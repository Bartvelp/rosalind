import fs from 'fs'

type Dna = 'A' | 'C' | 'T' | 'G'

function calculateProbabiltyOfdna(dna: string, gc: number): number {
    if (dna.length === 0) return Math.log10(1)
    const probs = {
        'A': (1 - gc) / 2,
        'T': (1 - gc) / 2,
        'G': gc / 2 ,
        'C': gc / 2
    }
    const rest = dna.slice(1)
    const currChance = probs[dna[0] as Dna]
    return Math.log10(currChance) + calculateProbabiltyOfdna(rest, gc)
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const dna = fileContent.split('\n')[0]
    const gcs = fileContent.split('\n')[1].split(' ').map(e => parseFloat(e))

    const log10probs = gcs.map(gc => calculateProbabiltyOfdna(dna, gc))
    console.log(log10probs.map(prob => prob.toFixed(3)).join(' '))
}