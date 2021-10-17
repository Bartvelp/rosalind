import { parseFasta } from './GC'
import fs from 'fs'

function calcFailureArray(dna: string) {
    const failureArray = new Array(dna.length).fill(0)
    for (let dnaPos = 1; dnaPos < dna.length; dnaPos++) {
        const prevLength = failureArray[dnaPos - 1]
        let newLength = 0
        for (let subLength = prevLength + 1; subLength > 0; subLength--) {
            const dnaPrefix = dna.slice(0, subLength)
            const curDnaSlice = dna.slice(dnaPos - subLength + 1, dnaPos + 1)
            // console.log('Checking', dnaPos, subLength, dnaPrefix, curDnaSlice)
            if (dnaPrefix === curDnaSlice) {
                newLength = subLength
                break
            }
        }
        failureArray[dnaPos] = newLength
    }
    return failureArray
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const dna = [...fastaMap.values()][0]
    const failureArray = calcFailureArray(dna)
    console.log(failureArray.join(' '))
}