import { calculateOptions } from "../math/calculatePermutations"

export function calcSingedPermOptions(n: number): number[][] {
    const permutation = Array.from(Array(n + 1).keys()).slice(1) // inits like [1, 2, 3, 4, n]
    const permutationOptions: number[][] = calculateOptions(permutation)

    const signedPermutations: number[][] = []
    for (let numNegative = 0; numNegative < n + 1; numNegative++) {
        const signStartOption = new Array(n).fill(1)
            .map((e, i) => i >= numNegative ? 1 : -1)
        const allSignOptions = calculateOptions(signStartOption)
        const uniqueSignOptions = getUniqueOptions(allSignOptions)
        uniqueSignOptions.forEach(signOption => {
            permutationOptions.forEach(permutationOption => {
                // permutationOption == [2, 1]
                // signOption = [-1, 1]
                const signedPermutationOption = permutationOption
                    .map((v, i) => v * signOption[i])
                signedPermutations.push(signedPermutationOption)
            })
        })
    }

    return signedPermutations
}

function getUniqueOptions(options: any[]) {
    const jsonOptions = options.map(e => JSON.stringify(e))
    const uniqueJson = [...new Set(jsonOptions)]
    const uniqueOptions = uniqueJson.map(e => JSON.parse(e))
    return uniqueOptions
}

if (require.main === module) {
    const n = parseInt(process.argv[2])
    const signedOptions = calcSingedPermOptions(n)
    console.log(signedOptions.length)
    signedOptions.forEach(option => console.log(option.join(' ')))
}