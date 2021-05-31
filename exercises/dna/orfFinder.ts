import fs from 'fs'
import { parseFasta } from './calculateGC'
import { dna2rna } from './dna2rna'
import { reverseComplement } from './reverseComplement'
import { rna2protein } from './rna2protein'

function findProteins(dna: string) {
    const readingFrames = getReadingFrames(dna)
    const rnaFrames = readingFrames.map(dna2rna)
    const protFrames = rnaFrames.map(rna2protein)

    const proteins: Set<string> = new Set()
    protFrames.forEach(frame => {
        const newProteins = extractProtein(frame)
        newProteins.forEach(p => proteins.add(p))
    })
    return [...proteins]
}

function extractProtein(prot: string) {
    const newProteins: string[] = []
    let mIndex = -1
    while (true) {
        mIndex++
        mIndex = prot.indexOf('M', mIndex)
        const stopIndex = prot.indexOf('*', mIndex)
        if (mIndex === -1 || stopIndex === -1) break
        const newProtein = prot.slice(mIndex, stopIndex)
        newProteins.push(newProtein)
    }
    return newProteins
}

function getReadingFrames(dna: string) {
    const revDna = reverseComplement(dna)
    const readingFrames = [
        dna, dna.slice(1), dna.slice(2), 
        revDna, revDna.slice(1), revDna.slice(2)
    ]
    return readingFrames
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fileContent)
    fastaMap.forEach(seq => {
        const proteins = findProteins(seq)
        console.log(proteins.join('\n'))
    })
}