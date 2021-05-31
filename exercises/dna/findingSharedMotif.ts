import fs from 'fs'
import { parseFasta } from './calculateGC'

function findLargestSharedMotif(fastaMap: Map<string, string>): string {
    const sequences = [...fastaMap.values()]
    if (sequences.length === 0) return ''

    const possibleMotifs = getAllSubstrings(sequences[0])

    const sharedSequenceMotifs = possibleMotifs.filter((needle) => {
        // Check if the searched motif is presen in all sequences
        return sequences.every((haystack) => haystack.includes(needle))
    }).sort((seqA, seqB) => seqB.length - seqA.length)

    if (sharedSequenceMotifs.length === 0) return ''
    else return sharedSequenceMotifs[0]
}

function getAllSubstrings(str: string): string[] {
    const options: string[] = []
    for (let start = 0; start < str.length; start++) {
        for (let end = str.length; end > start; end--) {
            const option = str.slice(start, end)
            options.push(option)
        }
    }
    return options
}

function onlyUnique(value: any, index: number, self: any[]) {
    return self.indexOf(value) === index;
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    
    console.log(findLargestSharedMotif(fastaMap))
}