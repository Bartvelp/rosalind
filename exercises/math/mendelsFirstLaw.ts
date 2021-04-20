/** k individuals are homozygous dominant for a factor, m are heterozygous, and n are homozygous recessive. */
function calculateProbabilityDominant(k: number, m: number, n: number): number {
    const total = k + m + n
    
    const chanceK = k / total 
    const chanceM = m / total 
    const chanceN = n / total

    const chanceMM = chanceM * ((m - 1) / (total - 1))
    const chanceMN = chanceM * (n / (total - 1)) * 2 // Times 2 since we have 2 options
    const chanceKM = chanceK * (m / (total - 1)) * 2
    const chanceKN = chanceK * (n / (total - 1)) * 2 
    const chanceKK = chanceK * ((k - 1) / (total - 1))

    const chanceKany = chanceKM + chanceKN + chanceKK
    // Calculate all options that have at least the chance of dominance
    return chanceKany * 1 + chanceMM * 0.75 + chanceMN * 0.5
}

// kkm gives
// [kk, mk, mk]
// kkkm gives
// [kk, kk, kk, mk, mk, mk]
// 5 / 6 * 4 / 5
if (require.main === module) {
    const k = parseInt(process.argv[2])
    const m = parseInt(process.argv[3])
    const n = parseInt(process.argv[4])
    console.log(calculateProbabilityDominant(k, m, n).toFixed(5))
}