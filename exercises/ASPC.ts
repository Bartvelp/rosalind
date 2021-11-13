/*
Given: Positive integers n and m with 0 ≤ m ≤ n ≤ 2000.
Return: The sum of combinations C(n,k) for all k satisfying m≤k≤n, modulo 1,000,000. In shorthand, ∑nk=m(nk).

i.e. 
n = m = 4 => {1, 2, 3, 4} = 1
n = 4, m = 3 => {1, 2, 3}, {1, 2, 4}, {1, 3, 4}, {2, 3, 4} = 4
*/

function factorial(n: bigint): bigint {
    if (n <= 1n) return 1n
    else return n * factorial(n - 1n)
}

function numSubsetsOfSize(n: bigint, k: bigint): number {
    // Calculate the number of subsets with size k
    const numOptions = factorial(n) / (factorial(k) * factorial(n - k))
    return Number(numOptions % 1000000n)
}

function sumCombinations(numExonsAvailable: bigint, minNumExonsUsed: bigint): number {
    let numOptions = 0
    for (let i = minNumExonsUsed; i <= numExonsAvailable; i++) numOptions += numSubsetsOfSize(numExonsAvailable, i)
    return numOptions % 1000000
}

if (require.main === module) {
    const numExonsAvailable = BigInt(process.argv[2])
    const minNumExonsUsed = BigInt(process.argv[3])
     
    console.log(sumCombinations(numExonsAvailable, minNumExonsUsed))
}