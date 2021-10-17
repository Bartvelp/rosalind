import fs from 'fs'
import { parseFasta } from './GC'

function findLongestCommonSubSequence(seqA: string, seqB: string) {
    const bases = ['A', 'C', 'G', 'T']
    const shortestSeqLen = Math.min(seqA.length, seqB.length)

    let curSubSequence = ''
    for (let i = 0; i < shortestSeqLen; i++) {
        const element = seqA[i];
        
    }
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fileContent)
    const sequences = [...fastaMap.values()]
    console.log(findLongestCommonSubSequence(sequences[0], sequences[1]))
}