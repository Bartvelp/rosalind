const massTableStr = `A   71.03711
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
Y   163.06333
H20 18.01056
`

const massMap = new Map(
    massTableStr
        .split('\n')
        .filter(line => line.length > 1)
        .map(line => {
    const lineParts = line.split(' ')
    const aminoAcidCode = lineParts[0]
    const weight = parseFloat(lineParts.at(-1) ?? "-1")
    return [aminoAcidCode, weight]
}))

function findClosestAminoAcid(weight: number) {
    const options = [...massMap.entries()]
    const closestAminoAcid = options.reduce((closestOption, curOption) => {
        const curDif = Math.abs(curOption[1] - weight)
        const bestDif = Math.abs(closestOption[1] - weight)
        return curDif < bestDif ? curOption : closestOption
    }, options[0])
    return closestAminoAcid[0]
}

export function getMassOfProtein(protein: string) {
    return protein
        .split('')
        .reduce((acc, curAA) => acc += massMap.get(curAA) ?? 0, 0)
}

function getProteinIdentFromBIons(weights: number[]) {
    let protein = ''
    for (let i = 1; i < weights.length; i++) {
        const prevWeight = weights[i - 1]
        const curWeight = weights[i]
        const weightOfAA = curWeight - prevWeight
        const aminoAcid = findClosestAminoAcid(weightOfAA)
        const diffWeight = Math.abs((massMap.get(aminoAcid) ?? 0) - weightOfAA)
        console.log(`Found ${aminoAcid} with ${diffWeight.toFixed(4)} diff`)
        protein += aminoAcid
    }
    return protein
}

// deno-lint-ignore no-unused-vars
const sampleDataSet = `
3524.8542
3710.9335
3841.974
3970.0326
4057.0646
`
if (import.meta.main) {
    const weights = Deno.readTextFileSync("/home/bart/Downloads/rosalind_spec.txt")
        .split('\n')
        .map(line => parseFloat(line))
        .filter(e => !isNaN(e))
    
    console.log(getProteinIdentFromBIons(weights))
}