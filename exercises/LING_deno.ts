import { genAllSuffixes, genTree, makeRandomDNAstring, Edge } from "./SUFF_deno.ts";

export function getTree(sequence: string) {
    const allSuffixes = genAllSuffixes(sequence)
    const tree = genTree(allSuffixes)
    return tree
}

function getMaximumSubstringCount(numAlphaBetOptions: number, stringLen: number, subStringLen: number) {
    // a, n, k
    const numTotalPossible = Math.pow(numAlphaBetOptions, subStringLen)
    const numWindowsInString = stringLen - subStringLen + 1
    return numTotalPossible < numWindowsInString ? numTotalPossible : numWindowsInString
}

export function naiveCountSubstrings(sequence: string, k: number, numPossible: number) {
    if (k > 1000) return numPossible
    const observedSubstrings: Set<string> = new Set()
    for (let i = 0; i < sequence.length - k + 1; i++) {
        const subString = sequence.slice(i, i + k)
        observedSubstrings.add(subString)
        if (observedSubstrings.size === numPossible) return observedSubstrings.size
    }
    console.log(k, 'required full compute')
    return observedSubstrings.size
}

const sampleDataSet = "ATTTGGATT$"
// const sampleDataSet = makeRandomDNAstring(1 * 1000, 'ACT') + "$"

if (import.meta.main) {
    const sequence = Deno.args.length === 0
        ? sampleDataSet
        : Deno.readTextFileSync(Deno.args[0]).replaceAll('\n', '') + '$'
    const treeEdges = getTree(sequence) // Takes 3 minutes...
    const allEdgeLabels = treeEdges.map(edge => edge.label)

    const numObservedTotal = allEdgeLabels.map(e => e.replace('$', '').length).reduce((len, acc) => acc += len)

    console.log("tree", numObservedTotal)
    const a = 4
    const s = sequence.slice(0, -1)
    let numPossibleTotal = 0

    for (let k = 1; k < s.length + 1; k++) numPossibleTotal += getMaximumSubstringCount(a, s.length, k)

    console.log(numObservedTotal, numPossibleTotal, numObservedTotal / numPossibleTotal)
}
// 40 -> 1500
// 60 -> 2450