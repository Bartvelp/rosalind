import fs from 'fs'
import { parseFasta } from './GC'

const bases = ['A', 'C', 'G', 'T']

function calculateProfile(fastaMap: Map<string, string>) {
    const sequences = [...fastaMap.values()]
    // All sequences are assumed to be of equal length    
    const profileColumn: number[][] = []
    for (let i = 0; i < sequences[0].length; i++) {
        const numBases = bases.map(base => {
            const chars = sequences.map(seq => seq[i])
            const numBase = chars.filter(presentBase => presentBase === base).length
            return numBase
        })
        profileColumn.push(numBases)
    }
    return profileColumn
}

function getConsensus(profileColumn: number[][]): string {
    let consensus = ''
    profileColumn.forEach(column => {
        const highest = Math.max(...column)
        const highestI = column.findIndex(v => v == highest)
        const highestBase = bases[highestI]
        consensus += highestBase
    })
    return consensus
}


function getProfileMap(profileColumn: number[][]): Map<string, number[]> {
    const profileMap: Map<string, number[]> = new Map([
        ['A', []],
        ['C', []],
        ['G', []],
        ['T', []]
    ])

    profileColumn.forEach(column => {
        bases.forEach(base => {
            const numBase = column[bases.findIndex(e => e === base)]
            const curEntry = profileMap.get(base) || []
            curEntry.push(numBase)
            profileMap.set(base, curEntry)
        })
    })
    return profileMap
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const profile = calculateProfile(fastaMap)
    const concensus = getConsensus(profile)
    console.log(concensus)
    const profileMap = getProfileMap(profile)
    // Display profile matrix in the way the awnser wants
    bases.forEach(base => {
        const entries = profileMap.get(base) || []
        console.log(`${base}: ${entries.join(' ')}`)
    })
}
