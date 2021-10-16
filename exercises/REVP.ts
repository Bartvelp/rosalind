import fs from 'fs'
import { parseFasta } from './GC'
import { reverseComplement } from './REVC'

export function findReversePalindromes(dna: string, minLen = 4, maxLen = 12) {
    const matches = []
    for (let i = 0; i < dna.length; i++) {
        const dnaRemaining = dna.slice(i)
        for (let len = minLen; len < maxLen + 1; len++) {
            const dnaSub = dnaRemaining.slice(0, len)
            if (dnaSub.length != len) continue // Reached the end of the dna
            const revcDnaSub = reverseComplement(dnaSub)
            if (dnaSub === revcDnaSub) matches.push([i, len])
        }
    }
    return matches
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const firstSequence = [...fastaMap.values()][0]
    const matches = findReversePalindromes(firstSequence)
    // Print like rosalind wants it
    matches.forEach(match => console.log(match[0] + 1, match[1]))
}