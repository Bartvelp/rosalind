import { parseFasta } from "./calculateGC"
import fs from 'fs'
import { dna2rna } from "./dna2rna"
import { rna2protein } from "./rna2protein"

function removeIntrons(dna: string, introns: string[]):string {
    let newDNA = dna
    introns.forEach(intronDNA => {
        newDNA = newDNA.replaceAll(intronDNA, '')
    })
    return newDNA
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const sequences = [...fastaMap.values()]
    const codingSequence = removeIntrons(sequences[0], sequences.slice(1))
    let protein = rna2protein(dna2rna(codingSequence))
    if (protein.indexOf("*") !== -1) protein = protein.slice(0, protein.indexOf("*"))
    console.log(protein)
}