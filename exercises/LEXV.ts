import fs from 'fs'
import { calculateCombinations } from './LEXF'

function generateAllOptions(alphabet: string[], maxLen: number) {
    const allOptions = []
    for (let i = 1; i <= maxLen; i++) allOptions.push(...calculateCombinations(alphabet, i))
    return allOptions
}

function sortOptions(alphabet: string[], optionA: string, optionB: string) {
    if (optionA === optionB) return 0
    const shortestOption = Math.min(optionA.length, optionB.length)
    for (let i = 0; i < shortestOption; i++) {
        const curCharA = optionA[i]
        const curCharB = optionB[i]
        const aIndex = alphabet.indexOf(curCharA)
        const bIndex = alphabet.indexOf(curCharB)
        if (aIndex < bIndex) return -1
        else if (aIndex > bIndex) return 1
    }
    return 1
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const lines = fileContent.split('\n')
    const alphabet = lines[0].split(' ')
    const maxLen = parseInt(lines[1])
    const allOptions = generateAllOptions(alphabet, maxLen)
    const sortedOptions = allOptions.sort((a, b) => sortOptions(alphabet, a, b))
    console.log(sortedOptions.join('\n'))
}