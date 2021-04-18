export function countDNA(dna: string) {
    const bases = ['A', 'C', 'G', 'T']
    const counts = [0, 0, 0, 0]
    bases.forEach((base, i) => {
        counts[i] = dna.split(base).length - 1 // Count number of occurences
    })
    return counts
}

if (require.main === module) {
    const counts = countDNA(process.argv[2])
    console.log(counts[0], counts[1], counts[2], counts[3])
}