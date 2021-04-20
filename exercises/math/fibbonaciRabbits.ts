export function calculateNumRabbits(n: number, k: number): number {
    let numAdultRabbits = 0
    let numYoungRabbits = 1
    for (let i = 1; i < n; i++) {
        const newBabies = numAdultRabbits * k
        numAdultRabbits += numYoungRabbits // Let the young babies grow up
        numYoungRabbits = newBabies // Reset young babies as new offspring
    }
    return numYoungRabbits + numAdultRabbits
}

if (require.main === module) {
    const n = parseInt(process.argv[2])
    const k = parseInt(process.argv[3])
    console.log(calculateNumRabbits(n, k))
}