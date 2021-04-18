import fs from 'fs'
import { countDNA } from './dna'

/** Returns map of header: sequence. */
export function parseFasta(fileContent: string):Map<string, string> {
    const lines = fileContent.split('\n')
    const fastaMap:Map<string, string> = new Map()
    
    let currentHeader = ''
    let currentSequence = ''
    lines.forEach(line => {
        if (line.startsWith('>')) {
            // Save previous entry (if it exists)
            if (currentHeader) fastaMap.set(currentHeader, currentSequence)
            // Init new entry
            currentHeader = line.slice(1)
            currentSequence = ''
        } else {
            // It's a sequence line
            currentSequence += line
        }
    })
    if (currentSequence) { // We haven't finished the last entry
        fastaMap.set(currentHeader, currentSequence)
    }
    return fastaMap
}

function getHighestGC(fastaMap: Map<string, string>) {
    let highestGC = 0
    let highestGCheader = ''
    fastaMap.forEach((sequence, header) => {
        const baseCounts = countDNA(sequence)
        const gcRatio = (baseCounts[1] + baseCounts[2]) / baseCounts.reduce((a, b) => a + b, 0)
        if (gcRatio > highestGC) {
            highestGC = gcRatio
            highestGCheader = header
        }
    })
    return { ratio: highestGC, header: highestGCheader}
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const highestGC = getHighestGC(fastaMap)
    console.log(highestGC.header)
    console.log(highestGC.ratio * 100)
}
