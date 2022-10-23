export function parseFasta(fileContent: string):Map<string, string> {
    const lines = fileContent.replaceAll('\r', '').split('\n')
    const fastaMap:Map<string, string> = new Map()
    
    let currentHeader = ''
    let currentSequence = ''
    lines.forEach(line => {
        if (line.startsWith('>')) {
            // Save previous entry (if it exists)
            if (currentHeader) fastaMap.set(currentHeader, currentSequence)
            // Init new entry
            currentHeader = line.slice(1)
            currentSequence = ''
        } else {
            // It's a sequence line
            currentSequence += line
        }
    })
    if (currentSequence) { // We haven't finished the last entry
        fastaMap.set(currentHeader, currentSequence)
    }
    return fastaMap
}

function findLongestCommonSubSequence(sequenceA: string, sequenceB: string) {
    const posSeqA: number[][] = []
    const posSeqB: number[][] = []

    for (let i = 0; i < sequenceA.length; i++) posSeqA[i] = findAllIndicesOfChar(sequenceB, sequenceA[i])
    for (let i = 0; i < sequenceB.length; i++) posSeqB[i] = findAllIndicesOfChar(sequenceA, sequenceB[i])

    const greedySubSequencesA = []
    const greedySubSequencesB = []
    for (let i = 0; i < sequenceA.length; i++) greedySubSequencesA.push(findGreedySubSequence(posSeqA.slice(i)))
    for (let i = 0; i < sequenceB.length; i++) greedySubSequencesB.push(findGreedySubSequence(posSeqB.slice(i)))

    const charSequences = [greedySubSequencesA.map(positions => positions.map(pos => sequenceB[pos]).join('')),
                           greedySubSequencesB.map(positions => positions.map(pos => sequenceA[pos]).join(''))]
    return charSequences.flat().reduce((longest, cur) => cur.length > longest.length ? cur : longest )
}

function findGreedySubSequence(positionArray: number[][]) {
    const sequence: number[] = []
    for (let i = 0; i < positionArray.length; i++) {
        const currentPos = positionArray[i]
        const possiblePositions = currentPos.filter(position => position > (sequence.at(-1) ?? -1))
        if (possiblePositions.length > 0) sequence.push(possiblePositions[0])
    }
    return sequence
}


// const lookupTable
function findAllIndicesOfChar(str: string, char: string) {
    const indices: number[] = []
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) indices.push(i)
    }
    return indices
}

if (import.meta.main) {
    const fastaContent = `
>Rosalind_23
GATTTTTTTAG
>Rosalind_64
GAAGTTTTTAG
`
    const sequences = [...parseFasta(fastaContent).values()]
    console.log(sequences)
    const longComSubSeq = findLongestCommonSubSequence(sequences[0], sequences[1])
    console.log(longComSubSeq)
}