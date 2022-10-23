// Jezus we got some complex set theory


export function generateMinkowskiDifference(setA: Set<number>, setB: Set<number>) {
    const diffSet =
        // Loop over every entry of setA
        [...setA.values()].flatMap(entryA => {
            // And then calculate the difference between this entry, and all entries of setB
            return [...setB.values()].map(entryB => entryA - entryB)
        })
    // We cannot actually return a set, because JS sets are _not_ multisets
    return diffSet
}

function areSame(floatA: number, floatB: number, maxDiff = 0.001) {
    return Math.abs(floatA - floatB) < maxDiff
}

export function findLargestMultiplicity(minkowSet: number[]) {
    // A.K.A most common item
    const multiplicityMap: Map<number, number> = new Map() // Key is difference, value is numOccurence
    minkowSet.forEach(value => {
        if (multiplicityMap.has(value)) return // Do not double count (but floats are hard to compare)
        const sameValuesArray = [...minkowSet.values()].filter(e => areSame(value, e))
        multiplicityMap.set(value, sameValuesArray.length)
    })
    const mostCommonItem = [...multiplicityMap.entries()].reduce((prev, cur) => cur[1] > prev[1] ? cur : prev)
    return {
        value: mostCommonItem[0],
        numOccurances: mostCommonItem[1]
    }
}

// deno-lint-ignore no-unused-vars
const sampleDataSet = `
186.07931 287.12699 548.20532 580.18077 681.22845 706.27446 782.27613 968.35544 968.35544
101.04768 158.06914 202.09536 318.09979 419.14747 463.17369
`

if (import.meta.main) {
    const weights = Deno.readTextFileSync("/home/bart/Downloads/rosalind_conv_2.txt")
        .split('\n')
        .filter(line => line.length > 1)
        .map(line => line.split(' ').map(e => parseFloat(e)))

    const setA = new Set(weights[0])
    const setB = new Set(weights[1])
    const minkowSet = generateMinkowskiDifference(setA, setB)
    const mostCommonDiff = findLargestMultiplicity(minkowSet)
    console.log(mostCommonDiff.numOccurances)
    console.log(mostCommonDiff.value.toFixed(5))
}