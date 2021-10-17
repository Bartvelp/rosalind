import fs from 'fs'
import { parseFasta } from './GC'

export function findSubsequence(haystack: string, needle: string): number[] {
    let lastIndex = 0
    const indices: number[] = []
    needle.split('').forEach(char => {
        const closestNextChar = haystack.indexOf(char, lastIndex)
        lastIndex = closestNextChar + 1 // Must progress at least 1 base
        indices.push(closestNextChar)
    })
    return indices
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const [haystack, needle] = [...fastaMap.values()]
    const indices = findSubsequence(haystack, needle)
    console.log(indices.map(n => ++n).join(' '))
    // Verify
    const reconstrucedNeedle = indices.map(i => haystack.charAt(i)).join('')
    console.log(reconstrucedNeedle === needle)
}
