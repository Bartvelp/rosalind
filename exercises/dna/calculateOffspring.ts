
/**
 * 
 * @param a num AA-AA
 * @param b num AA-Aa
 * @param c num AA-aa
 * @param d num Aa-Aa
 * @param e num Aa-aa
 * @param f num aa-aa
 * 
 * @return The expected number of offspring displaying the dominant phenotype in the next generation, 
 * under the assumption that every couple has exactly two offspring
 */
function calcAverageOffsprint(a: number, b: number, c: number, d: number, e: number, f: number): number {
    const resABC = a * 1 * 2 + b * 1 * 2 + c * 1 * 2 // 100% chance of all offspring with dominance
    const resD = d * 0.75 * 2 // 75% chance at least one of the parents gives dominance
    const resE = e * 0.5 * 2 // 50% chance the first parent gives dominance
    // f for sure doesn't give dominance
    return resABC + resD + resE
}


if (require.main === module) {
    const [a, b, c, d, e, f] = process.argv.slice(2).map(e => parseInt(e))
    const averageDominant = calcAverageOffsprint(a, b, c, d, e, f)
    console.log(averageDominant)
}
