import { parseFasta } from "./calculateGC"
import fs from 'fs'
import fetch from 'node-fetch'

export function findNGlycosylationSites(sequence: string): number[] {
    const sites = []
    if (!sequence) return []
    const seq = sequence.split('')
    for (let i = 0; i < seq.length - 3; i++) {
        if (seq[i] === 'N' && seq[i + 1] !== 'P' && (seq[i + 2] === 'S' || seq[i + 2] == 'T') && seq[i + 3] !== 'P') {
            sites.push(i)
        }
    }
    return sites
}

async function getSequence(id: string) {
    const fastaContent = await fetch(`http://www.uniprot.org/uniprot/${id}.fasta`).then(r => r.text())
    const fastaMap = parseFasta(fastaContent)
    return [...fastaMap.values()][0]
}

async function main() {
    const uniprotIDs = fs.readFileSync(process.argv[2], 'utf-8').split('\n').filter(e => !!e) // Filter empty lines
    const sequenceMap: Map<string,string> = new Map()
    await Promise.all(uniprotIDs.map(async id => {
        const sequence = await getSequence(id)
        sequenceMap.set(id, sequence)
    }))
    sequenceMap.forEach((sequence, id) => {
        const sites = findNGlycosylationSites(sequence).map(e => e + 1) // Rosalind likes 1-indexed
        if (sites.length === 0) return
        console.log(id)
        console.log(sites.join(' '))
    })
}

if (require.main === module) {
    main()
}