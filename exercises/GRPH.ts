import fs from 'fs'
import { parseFasta } from './GC'

type Edge = [string, string]

function getOverlayGraph(fastaMap: Map<string, string>, k: number): Edge[] {
    const edges: Edge[] = []
    fastaMap.forEach((sequence1, header1) => {
        const suffix = sequence1.slice(-k)
        // Now try to find this suffix in any of the other sequences
        fastaMap.forEach((sequence2, header2) => {
            if (sequence1 === sequence2) return // Can't be the same
            const prefix = sequence2.slice(0, k)
            // Add them if the suffix == prefix
            if (suffix === prefix) edges.push([header1, header2])
        })
    })
    return edges
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const edges = getOverlayGraph(fastaMap, 3)
    // Print them as the awnser requires
    edges.forEach(edge => console.log(edge[0], edge[1]))
}
