import fs from 'fs'

function parseInput(path: string): [string[], number] {
    const fileContent = fs.readFileSync(path, 'utf-8')
    const lines = fileContent.split('\n')
    const alphabet = lines[0].split(' ')
    const length = parseInt(lines[1])
    return [alphabet, length]
}

export function calculateCombinations(options: string[], length: number) {
    const allOptions: string[] = []
    if (length === 1) return options
    const prefixOptions = calculateCombinations(options, length - 1) // [A, C, T, G]
    prefixOptions.forEach(prefixOption => {
        const newOptions = options.map(option => prefixOption + option)
        allOptions.push(...newOptions)
    })
    return allOptions
}

if (require.main === module) {
    const [alphabet, length] = parseInput(process.argv[2])
    const combos = calculateCombinations(alphabet, length)
    combos.forEach(option => console.log(option))
}