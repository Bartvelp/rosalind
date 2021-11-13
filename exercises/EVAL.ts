import fs from 'fs'

type Dna = 'A' | 'C' | 'G' | 'T'

function calcNumExpected (DNAlength: number, motif: string, gcRatio: number): number {
    const baseChance = {
        A: (1 - gcRatio) / 2,
        C: gcRatio / 2,
        G: gcRatio / 2,
        T: (1 - gcRatio) / 2
    }
    // first calculate the chance a random string of length n == motif
    const motifChance = motif
        .split('')
        .reduce((acc, base) => acc * baseChance[base as Dna], 1)
    return motifChance * (DNAlength - motif.length + 1)
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const lines = fileContent.split('\n')
    const DNAlength = parseInt(lines[0])
    const DNAmotif = lines[1]
    const gcRatios = lines[2].split(' ').map(e => parseFloat(e))

    const numsExpectedMotifs = gcRatios
        .map(gcRatio => calcNumExpected(DNAlength, DNAmotif, gcRatio).toFixed(3))
    console.log(numsExpectedMotifs.join(' '))
}