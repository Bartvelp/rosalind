import fs from 'fs'

function chunk (arr: any[], len: number) {
    // https://stackoverflow.com/a/11764168
    const chunks = []
    let i = 0
    const n = arr.length

    while (i < n) {
        chunks.push(arr.slice(i, i += len))
    }
    return chunks
}

function calcReversalDistance (permutationPair: number[][]) {
    const origPermutation = permutationPair[0]
    const newPermutation = permutationPair[1]

    let numSteps = 0
    let workingPermutation = [...newPermutation] // Do not modify original array

    for (let i = 0; i < workingPermutation.length; i++) {
        const wantedNum = origPermutation[i]
        const numIndex = workingPermutation.indexOf(wantedNum) // 1
        if (numIndex === i) continue // i = 0
        numSteps++ // We need a step, calculate the reversal
        const prefix = workingPermutation.slice(0, i)
        const switchedPart = workingPermutation
            .slice(i, numIndex + 1)
            .reverse()
        const suffix = workingPermutation.slice(numIndex + 1)
        workingPermutation = [...prefix, ...switchedPart, ...suffix]
    }
    if (origPermutation.join(' ') !== workingPermutation.join(' ')) throw new Error('Failed')
    return numSteps
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const allLines = fileContent.split('\n')
    const lines = allLines.filter(line => line !== '')
    const permutations = lines.map(line => line.split(' ').map(num => parseInt(num)))
    const permutationPairs: number[][][] = chunk(permutations, 2)
    const numStepsPerPair = permutationPairs.map(pair => calcReversalDistance(pair))
    console.log(numStepsPerPair.join(' '))
}