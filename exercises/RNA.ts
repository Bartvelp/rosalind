export function dna2rna(dna: string):string {
    return dna.replaceAll('T', 'U')
}

if (require.main === module) {
    console.log(dna2rna(process.argv[2]))
}