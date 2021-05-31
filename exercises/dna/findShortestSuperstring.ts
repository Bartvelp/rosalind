import fs from 'fs'
import { parseFasta } from './calculateGC'

/*
The dataset is guaranteed to satisfy the following condition: 
there exists a unique way to reconstruct the entire chromosome from these reads 
by gluing together pairs of reads that overlap by more than half their length.

>Rosalind_56
ATTAGACCTG
>Rosalind_57
CCTGCCGGAA
>Rosalind_58
AGACCTGCCG
>Rosalind_59
GCCGGAATAC
*/

function calcNumOverlap(a: string, b: string):number {
    for (let i = a.length - 1; i >= 0; i--) {
        const suffix = a.slice(-1 * i)
        const prefix = b.slice(0, i)
        if (suffix === prefix) return suffix.length
    }
    return 0
}

function findSuperstring(reads: string[]) {
    const possibilities = [...reads]
    // First find the read with an unique first half
    let firstIndex = possibilities.findIndex(readOne => {
        const numWithPrefix = possibilities.reduce((acc, readTwo) => {
            const numOverlap = calcNumOverlap(readTwo, readOne)
            if (numOverlap / readTwo.length > 0.5) acc++
            return acc
        }, 0)
        return numWithPrefix === 0
    })
    let chromosome = possibilities[firstIndex]
    possibilities.splice(firstIndex, 1)

    while (possibilities.length > 0) {
        for (let i = 0; i < possibilities.length; i++) {
            const read = possibilities[i]
            const lastRead = chromosome.slice(-1 * read.length)
            
            const numOverlap = calcNumOverlap(lastRead, read)
            if (numOverlap / read.length > 0.5) {
                chromosome += read.slice(numOverlap)
                // Remove current read from possibilities
                possibilities.splice(i, 1)
                break;
            }
        }
    }
    return chromosome
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const reads = [...fastaMap.values()]
    const superString = findSuperstring(reads)
    console.log(superString)
}