import fs from 'fs'
import { parseFasta } from './calculateGC'

function calcNumPerfectMatchings(rna: string) {
    const numA = (rna.match(/A/g)||[]).length
    const numG = (rna.match(/G/g)||[]).length
    return factorial(BigInt(numA)) * factorial(BigInt(numG))
}

export function factorial(n: bigint): bigint {
    if (n === 1n) return BigInt(1)
    return n * factorial(n - 1n)
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const rna = [...fastaMap.values()][0]
    console.log(calcNumPerfectMatchings(rna).toString())
}
