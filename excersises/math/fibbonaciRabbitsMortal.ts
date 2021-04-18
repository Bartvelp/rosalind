export function calculateNumRabbitsMortal(n: number, m: number): BigInt {
    // Start in month 1 with 1 young pair
    let numAdultRabbits = BigInt(0)
    let numYoungRabbits = BigInt(1)

    let pastResults = [[0,0], [0, 1]].map(m => m.map(e => BigInt(e))) // 0th month produced 1 baby rabbit (somehow)
    for (let monthNum = 2; monthNum <= n; monthNum++) {
        // Calcate current month based on previous month
        const monthNumBig = BigInt(monthNum)
        const newBabies = numAdultRabbits
        numAdultRabbits += numYoungRabbits // Let the young babies grow up
        numYoungRabbits = newBabies // Reset young babies as new offspring

        if (monthNum > m) { // The first rabbits start dying
            const numRabbitsToDie = pastResults[monthNum - m][1] // The rabbits born this month die
            // console.log(`@month:${monthNum}: Killing ${numRabbitsToDie} rabbits born in month: ${monthNum - m}`)
            numAdultRabbits += - BigInt(numRabbitsToDie)
        }
        
        pastResults[monthNum] = [numAdultRabbits, numYoungRabbits]
    }
    pastResults.forEach((numAlive, monthNum) => {
        // console.log(monthNum, numAlive)
    })
    return numAdultRabbits + numYoungRabbits
}

/*
Turns out I had it correct first try, but exceeded js number limit
So use BigInt for large numbers kids!
*/
if (require.main === module) {
    const n = parseInt(process.argv[2])
    const m = parseInt(process.argv[3])
    console.log(calculateNumRabbitsMortal(n, m))
}