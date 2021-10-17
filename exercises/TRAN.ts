import fs from 'fs'
import { parseFasta } from './GC'

type Dna = 'A' | 'C' | 'T' | 'G'

export function calcTransitionTransversionRatio(dna1: string, dna2: string): number {
    // Transition: A <-> G, T <-> C
    // Transversion: everything else
    const transitionTable = {
        'A': 'G',
        'G': 'A',
        'T': 'C',
        'C': 'T'
    }
    
    let numTransition = 0
    let numTransversion = 0

    for (let i = 0; i < dna1.length; i++) {
        const base1 = dna1[i] as Dna
        const base2 = dna2[i] as Dna
        if (base1 === base2) continue
        if (base1 === transitionTable[base2]) numTransition++
        else numTransversion++
    }
    return numTransition / numTransversion
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const [dna1, dna2] = [...fastaMap.values()]
    const ratio = calcTransitionTransversionRatio(dna1, dna2)
    console.log(ratio.toFixed(11))
}
