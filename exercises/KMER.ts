import { parseFasta } from './GC'
import { calculateCombinations } from './LEXF'
import fs from 'fs'

function calculateKmerComposition(dna: string, k: number) {
    const alphabet = ['A', 'C', 'G', 'T']
    const kmers = calculateCombinations(alphabet, k)
    const kmerCounts: Map<string, number> = new Map()
    kmers.forEach(kmer => kmerCounts.set(kmer, 0)) // Initilize all counts at 0
    // Now loop over the sequence, increasing by one and slicing the kmer length
    for (let i = 0; i <= dna.length - k; i++) {
        const kmer = dna.slice(i, i+k)
        const curCount = kmerCounts.get(kmer) || 0
        kmerCounts.set(kmer, curCount + 1)
    }
    const finalCounts = kmers.map(kmer => kmerCounts.get(kmer) || 0)
    return finalCounts
}

if (require.main === module) {
    const fastaContent = fs.readFileSync(process.argv[2], 'utf-8')
    const fastaMap = parseFasta(fastaContent)
    const dna = [...fastaMap.values()][0]
    const counts = calculateKmerComposition(dna, 4)
    console.log(counts.join(' '))
}