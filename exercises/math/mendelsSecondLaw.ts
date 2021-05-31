/**
 * Assuming every organism mates with Aa Bb
 * @param k Number of generations
 * @param N Number of organisms with Aa Bb phenotype
 * @returns Probability at least N organisms have Aa Bb in generation k
 */
function calcProbabiltyAaBb(k: number, N: number): number {
    const numPop = Math.pow(2, k)
    if (N > numPop) return 0
    if (N == 0) return 1
    // Calculate the probabilities up to and including N
    const probabilities: number[] = []
    for (let i = N; i <= numPop; i++) {
        const probility = calcProbabiltyAaBbForN(k, i)
        probabilities.push(probility)
    }
    const summedProbabilities = probabilities.reduce((acc, cur) => acc += cur, 0)
    return summedProbabilities
}

/**
 * Assuming every organism mates with Aa Bb
 * @param k Number of generations
 * @param N Number of organisms with Aa Bb phenotype
 * @returns Probability exactly N organisms have Aa Bb in generation k
 */
function calcProbabiltyAaBbForN(k: number, N: number): number {
    const numPop = Math.pow(2, k)
    // ['AA', 'Aa', 'aA', 'aa'] is 50% chance Aa, same for Bb
    const chanceAaBb = 0.5 * 0.5 // chance mating produces AaBb
    // Chances like Good (G), Bad (B)
    // GGBBBBBBB...
    const chanceFirstisN = (chanceAaBb ** N) * ((1 - chanceAaBb) ** (numPop - N))
    //                     0.5 ^ 2         *   0.75 ^ 8
    // correct for the fact they can be in any order
    // BBGBBGBBB...
    const chanceGotN = chanceFirstisN * (factorial(numPop) / (factorial(N) * factorial(numPop - N)))
    // BBGG -> [BBGG, BGBG, GBGB, BGGB, GGBB, GBBG] == 4 * 3 * 2 / 2 * (2 * 1) = 6
    // BBG -> [BBG, BGB, GBB] == 3 * 2 * 1 / 1 * (2 * 1) == 3
    // https://en.wikipedia.org/wiki/Combination
    return chanceGotN
}

function factorial(num: number) {
    let rval=1;
    for (let i = 2; i <= num; i++) rval = rval * i;
    return rval;
}

if (require.main === module) {
    const k = parseInt(process.argv[2])
    const N = parseInt(process.argv[3])
    console.log(calcProbabiltyAaBb(k, N).toFixed(5))
}