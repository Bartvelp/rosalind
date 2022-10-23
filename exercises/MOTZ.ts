import { parseFasta } from "./GC"
import fs from 'fs'

import { generateAllOptions } from "./LEXV"


const motzkinNums = [1, 1]
function calcMotzkinNumber(n: number): number {
    if (n < motzkinNums.length) return motzkinNums[n]

    const numWhenNotUsed = calcMotzkinNumber(n - 1)

    let numWhenUsed = 0
    for (let k = 2; k <= n; k++) {
        const leftHand = calcMotzkinNumber(k - 2)
        const rightHand = calcMotzkinNumber(n - k)
        numWhenUsed += leftHand * rightHand
    }
    const result = numWhenUsed + numWhenNotUsed
    motzkinNums[n] = result
    return result
}

type Dna = 'A' | 'C' | 'T' | 'G'

function canPairMatch(dna: string) {
    if (dna.length !== 2) throw new Error('Invalid input')
    const matches = {
        'A': 'T',
        'T': 'A',
        'C': 'G',
        'G': 'C' 
    }
    return matches[dna[0] as Dna] === dna[1]
}

const matchingsMap: Map<string, number> = new Map()

function initMatchings(map: Map<string, number>) {
    // Init matchingsmap with default stuff
    const bases = ['A', 'C', 'G', 'T']
    const basePairOptions = generateAllOptions(bases, 2)
    basePairOptions.forEach(pair => {
        if (pair.length === 1) map.set(pair, 0)
        else if (!canPairMatch(pair)) map.set(pair, 0)
        else map.set(pair, 1)
    })
    map.set('', 1)
    // Now map contains all options and only matches contain 1
}

function calcNumMatchings(dna: string): number {
    if (matchingsMap.has(dna)) return matchingsMap.get(dna) as number
    if (matchingsMap.size === 0) initMatchings(matchingsMap)
    const numWhenNotUsed = calcNumMatchings(dna.slice(1))

    let numWhenUsed = 0
    for (let k = 2; k < dna.length; k++) {
        // const curBond = dna[0] + dna[k - 1]
        // const numOptionsBond = calcNumMatchings(curBond)

        const insideBond = dna.slice(0, k)
        const numOptionsInsideBond = calcNumMatchings(insideBond)

        const outsideBond = dna.slice(k, dna.length)
        const numOptionsOutsideBond = calcNumMatchings(outsideBond)

        numWhenUsed += numOptionsInsideBond * numOptionsOutsideBond
    }
    const result = ((numWhenUsed + numWhenNotUsed) + 2) % 1000000
    console.log(dna, result)

    matchingsMap.set(dna, result)
    return result
}

if (require.main === module) {
    // console.log(calcMotzkinNumber(parseInt(process.argv[2])))
    
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const sequences = [...fastaMap.values()]
    const dna = sequences[0].replaceAll('U', 'T')
    
    console.log(calcNumMatchings(dna))
}