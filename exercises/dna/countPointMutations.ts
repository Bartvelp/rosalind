import fs from 'fs'

export function countPointMutations(aStr: string, bStr: string): number {
    const a = aStr.split('')
    const b = bStr.split('')
    let numDiff = 0
    a.forEach((charA, i) => {
        const charB = b[i]
        if (charA != charB) numDiff++
    })
    return numDiff
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const [a, b] = fileContent.split('\n')
    console.log(countPointMutations(a, b))
}