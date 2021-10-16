import { getCodonTable } from "./PROT";

function calcNumOptions(proteinStr: string) {
    const codonTable = getCodonTable()
    const proteinCodes = proteinStr.split('')
    proteinCodes.push('*') // Add the stop codon
    
    let numOptions = 1
    proteinCodes.forEach(code => {
        const condonEntries = codonTable.filter(c => c.single === code)
        numOptions = numOptions * condonEntries.length
        numOptions = numOptions % 1000000 // Modulo so we can store big nums
    })
    return numOptions
}

if (require.main === module) {
    const proteinStr = process.argv[2]
    console.log(calcNumOptions(proteinStr))
}