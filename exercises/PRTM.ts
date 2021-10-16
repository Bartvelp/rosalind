const WEIGHT_TABLE = `
A   71.03711
C   103.00919
D   115.02694
E   129.04259
F   147.06841
G   57.02146
H   137.05891
I   113.08406
K   128.09496
L   113.08406
M   131.04049
N   114.04293
P   97.05276
Q   128.05858
R   156.10111
S   87.03203
T   101.04768
V   99.06841
W   186.07931
Y   163.06333`

export function getWeightMap(): Map<string, number> {
    const weights: Map<string, number> = new Map()
    WEIGHT_TABLE.split('\n').forEach(line => {
        const parts = line.split('   ')
        if (parts.length !== 2) return
        const aaCode = parts[0]
        const weight = parseFloat(parts[1])
        weights.set(aaCode, weight)
    })
    return weights
}

if (require.main === module) {
    const aminoacids = process.argv[2]
    const weights = getWeightMap()
    const weight = aminoacids
        .split('')
        .reduce((acc, aa) => acc += weights.get(aa) || 0, 0)
    console.log(weight.toFixed(3))
}