export function calculatePermutations(n: number) {
    const allStartOptions = Array.from(Array(n + 1).keys()).slice(1) // inits like [1, 2, 3, 4, n]
    const numPossibleOptions = allStartOptions.reduce((acc, current) => acc * current, 1)
    const allOptions = calculateOptions(allStartOptions)
    if (numPossibleOptions != allOptions.length) throw new Error('Not all options were calculated')
    else return allOptions
}

export function calculateOptions(currentOptions: any[]): any[][] {
    // currentOptions = [1, 2]
    if (currentOptions.length == 2) {
        return [currentOptions, currentOptions.slice().reverse()] // returns [[1, 2], [2, 1]]
    }
    // currentOptions = [1, 2, 3]
    const allOptions: any[][] = []
    currentOptions.forEach((before, i) => {
        // before contains 1 (or 2, 3 etc)
        const after = currentOptions.filter((val, j) => i !== j) // [2, 3]
        const newOptions = calculateOptions(after) // [[2, 3], [3, 2]]
        const fullOptions = newOptions.map(option => [before, ...option]) // [[1, 2, 3], [1, 3, 2]]
        allOptions.push(...fullOptions)
    })

    return allOptions
}

if (require.main === module) {
    const n = parseInt(process.argv[2])
    const permutations = calculatePermutations(n)
    console.log(permutations.length)
    permutations.forEach(option => console.log(option.join(' ')))
}
