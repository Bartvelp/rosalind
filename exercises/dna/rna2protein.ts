import fs from 'fs'
import path from 'path'

export function rna2protein(rna: string): string {
    const codonTable = getCodonTable()
    const codons = chunkString(rna, 3)
    let proteins = ''
    codons.forEach(codonRNA => {
        const codonEntry = codonTable.find(e => e.rna === codonRNA)
        if (codonEntry === undefined) return
        
        const proteinCode = codonEntry.single
        proteins += proteinCode
    })
    return proteins
}

function chunkString(str: string, length: number): string[] { // https://stackoverflow.com/a/7033662/5329317
    const results = str.match(new RegExp('.{1,' + length + '}', 'g'))
    if (results == null) return [str]
    else return [...results]
  }

interface Codon {
    rna: string; // RNA codon
    name: string; // full name
    abbr: string; // 3 letter code
    single: string; // 1 lettere code
}

export function getCodonTable(): Codon[] {
    
    const codonTableTSV = fs.readFileSync(path.join(__dirname, './codon_table.tsv'), 'utf-8')
    const lines = codonTableTSV.split('\n').slice(1) // Remove header

    const codonTable: Codon[] = []
    lines.forEach(line => {
        const parts = line.split('\t')
        const codon: Codon = {
            rna: parts[0].replaceAll('T', 'U').toUpperCase(),
            name: parts[1],
            abbr: parts[2],
            single: parts[3].toUpperCase()
        }
        codonTable.push(codon)
    })
    return codonTable
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const proteinString = rna2protein(fileContent)
    const firstProtein = proteinString.split('*')[0]
    console.log(firstProtein)
}