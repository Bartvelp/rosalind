import fs from 'fs'

/* 
Problem statement
    Given: A positive integer N ≤ 100000, a number x between 0 and 1, and a DNA string s of length at most 10 bp.
    Return: The probability that if N random DNA strings having the same length as s are constructed with GC-content x 
        (see “Introduction to Random Strings”), then at least one of the strings equals s. 
        We allow for the same random string to be created more than once.

So return 1 - the probility that no string is s
*/

type Dna = 'A' | 'C' | 'G' | 'T'

function calcProbabilityMotif(motif: string, gcRatio: number, numSequences: number): number {
    const baseChance = {
        A: (1 - gcRatio) / 2,
        C: gcRatio / 2,
        G: gcRatio / 2,
        T: (1 - gcRatio) / 2
    }
    // first calculate the chance a random string of length n == motif
    const chanceSameAsMotif = motif
        .split('')
        .reduce((acc, base) => acc * baseChance[base as Dna], 1)
    
    const chanceNotMotif = 1 - chanceSameAsMotif
    const chanceAllNotMotif = Math.pow(chanceNotMotif, numSequences)
    const chanceAtLeastOneMotif = 1 - chanceAllNotMotif
    return chanceAtLeastOneMotif
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const lines = fileContent.split('\n')
    const numSequences = parseInt(lines[0].split(' ')[0])
    const gcRatio = parseFloat(lines[0].split(' ')[1])
    const motif = lines[1]
    
    const probability = calcProbabilityMotif(motif, gcRatio, numSequences)
    console.log(probability.toFixed(4))
}