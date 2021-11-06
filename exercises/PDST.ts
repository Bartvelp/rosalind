import fs from 'fs'
import { parseFasta } from './GC'
import { countPointMutations } from './HAMM'

function genDistMatrix(sequences: string[]) {
    const numSeq = sequences.length
    const distMatrix: number[][] = Array.from(Array(numSeq), () => new Array(numSeq).fill(0))
    for (let i = 0; i < distMatrix.length; i++) {
        for (let j = 0; j < distMatrix.length; j++) {
            const seqA = sequences[i]
            const seqB = sequences[j]
            const numDiff = countPointMutations(seqA, seqB)
            distMatrix[i][j] = numDiff / seqA.length
        }
    }
    return distMatrix
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const sequences = [...fastaMap.values()]
    const distMatrix = genDistMatrix(sequences)
    distMatrix.forEach(row => {
        const niceRow = row
            .map(i => i.toFixed(5))
            .join(' ')
        console.log(niceRow)
    })
}