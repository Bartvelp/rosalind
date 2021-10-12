// cn denote the number of noncrossing perfect matchings
// the complete graph K2n
// As for the case of a general n, say that the nodes of 
// K2n are labeled with the positive integers from 1 to 2n
// m=2k for some positive integer k.

// cn = sum[k to n](ck-1 * c(n-k))
import { parseFasta } from "./calculateGC"
import fs from 'fs'

const lookupTable = [1]
function genCatalanNumbers(n: number):number {
    // cn = sum[k to n](ck-1 * c(n-k))
    // Fill lookuptable
    for (let k = 1; k <= n; k++) {
        for (let i = 0; i <= k-1; i++) {
            console.log(k, n, i, lookupTable[i], lookupTable[n - i])
            const cn = lookupTable[i] * lookupTable[n - i]
            lookupTable[k] = cn
        }
    }
    return lookupTable[n]
}

if (require.main === module) {
    console.log(genCatalanNumbers(2))
    /*
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const sequences = [...fastaMap.values()]
    const codingSequence = removeIntrons(sequences[0], sequences.slice(1))
    let protein = rna2protein(dna2rna(codingSequence))
    if (protein.indexOf("*") !== -1) protein = protein.slice(0, protein.indexOf("*"))
    console.log(protein)
    */
}