import { factorial } from './PMCH'

if (require.main === module) {
    const [n, k] = process.argv.slice(2).map(e => parseInt(e))
    const numOptions = factorial(BigInt(n)) / factorial(BigInt(n - k))
    console.log((numOptions % 1000000n).toString())
    // 21 * 20 * 19 * 18 * 17 * 16 * 15 * 14 * ... / 14 * ...
}