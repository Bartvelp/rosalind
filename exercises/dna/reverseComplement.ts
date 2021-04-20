function reverseComplement(dna: string):string {
    const pairs = new Map([
        ['A', 'T'],
        ['T', 'A'],
        ['G', 'C'],
        ['C', 'G']
    ])
    // Getto method to reverse a string, by first converting it to an array
    const reversedDna = dna.split('').reverse()
    const reverseComplement = reversedDna.map(base => pairs.get(base))

    // return a string by joining the array
    return reverseComplement.join('')
}

if (require.main === module) {
    console.log(reverseComplement(process.argv[2]))
}