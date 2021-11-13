/* Problem statement
Given: A positive integer n (n≤1000).

Return: The total number of subsets of {1,2,…,n} modulo 1,000,000.

n = 0 == 1  => {}
n = 1 == 2  => {}, {1}
n = 2 == 4  => {}, {1}, {2}, {1, 2}
n = 3 == 8  => {}, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3}
n = 4 == 16 => {}, {1}, {2}, {3}, {4}, 5
                   {1, 2}, {1, 3}, {1, 4}, {2, 3}, {2, 4}, {3, 4} 6
                   {1, 2, 3}, {1, 2, 4}, {1, 3, 4}, {2, 3, 4} 4
                   {1, 2, 3, 4}
i.e. num permutations of a set of len n:
{1,0,0,0}, {0,1,0,0}, {0,0,1,0}, {0,0,0,1}
{1,1,0,0}, {1,0,1,0}, {1,0,0,1}, {0,1,1,0} etc.

length is Math.pow(2, n)
*/

function numSubsets(n: number): number {
    /* Implementation in BigInt, but it was not needed
    let total: bigint = BigInt(1)
    for (let i = 0; i < n; i++) total *= BigInt(2)
    console.log(total)
    */
    return Math.pow(2, n)
}

if (require.main === module) {
    const n = parseInt(process.argv[2])
    console.log(numSubsets(n) % 1000000)
}