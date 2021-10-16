// cn denote the number of noncrossing perfect matchings
// the complete graph K2n
// As for the case of a general n, say that the nodes of 
// K2n are labeled with the positive integers from 1 to 2n
// m=2k for some positive integer k.

// cn = sum[k to n](ck-1 * c(n-k))

import { parseFasta } from "./GC"
import fs from 'fs'

const catalanNumbers = [1, 1] // number of nodes [0, 2, 4, 6, 8]
function genCatalanNumbers(numberOfNodes: number):number {
    if (numberOfNodes % 2 !== 0) console.log("changing numNodes to", ++numberOfNodes) // Make it even
    const numEven = numberOfNodes / 2
    // Fill the lookup table to numEven
    for (let n = 2; n <= numEven; n++) {
        // Calculate one number for now
        let totalNumPermutations = 0
        for (let k = 1; k <= n; k++) {
            const numPermutations = catalanNumbers[k - 1] * catalanNumbers[n - k]
            totalNumPermutations += numPermutations
        }
        catalanNumbers[n] = totalNumPermutations
    }
    return catalanNumbers[numEven]
}

const baseMatchHistory: Map<string, number> = new Map() // Base string | numPos
function genNumBasePairMatchingsRecursive(dna: string): number {
    if (baseMatchHistory.get(dna) !== undefined) return baseMatchHistory.get(dna) as number
    if (dna.length % 2 !== 0) return 0 // Always one base will be unmatched
    if (dna.length === 0) return 1
    if (dna.length === 2) return canMatch(dna[0] as Dna, dna[1] as Dna) ? 1 : 0
    let sum = 0
    for (let basePairNum = 1; basePairNum < dna.length; basePairNum += 2) {
        const firstBase = dna[0] as Dna
        const matchBase = dna[basePairNum] as Dna
        if (canMatch(firstBase, matchBase)) {
            // Split right and left side of the DNA string
            const rightSide = dna.slice(1, basePairNum)
            const leftSide = dna.slice(basePairNum + 1)
            // Calc options
            const numOptionsLeft = genNumBasePairMatchingsRecursive(leftSide)
            const numOptionsRight = genNumBasePairMatchingsRecursive(rightSide)

            baseMatchHistory.set(leftSide, numOptionsLeft)
            baseMatchHistory.set(rightSide, numOptionsRight)

            const result = (numOptionsLeft * numOptionsRight) % 1000000
            baseMatchHistory.set(dna, result) // 176484
            sum += result
            // console.log('Got left right', leftSide, rightSide, numOptionsLeft, numOptionsRight)
        }
    }
    return sum % 1000000
}
type Dna = 'A' | 'C' | 'T' | 'G'

function canMatch(bpOne: Dna, bpTwo: Dna) {
    const matches = {
        'A': 'T',
        'T': 'A',
        'C': 'G',
        'G': 'C' 
        /* OMG I spend 3+ hours discovering other methods, e.g. NUSSINOV et al. to later discover
           this implementation was correct after all, but I mistyped the above table.
        */
    }
    return bpTwo === matches[bpOne]
}

if (require.main === module) {
    // console.log(genCatalanNumbers(20))

    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const sequences = [...fastaMap.values()]
    const dna = sequences[0].replaceAll('U', 'T')
    console.log(genNumBasePairMatchingsRecursive(dna))
}