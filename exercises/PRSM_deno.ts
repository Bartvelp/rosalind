import { findLargestMultiplicity, generateMinkowskiDifference } from "./CONV_deno.ts";
import { getMassOfProtein } from "./SPEC_deno.ts";

function parseDataSet(rawDataSet: string) {
    const lines = rawDataSet
        .split('\n')
        .filter(line => line.length > 0)
        .slice(1) // Remove first entry, not needed
    const dataset = {
        proteinOptions: [] as string[],
        ourProteinMultiSet: [] as number[]
    }
    lines.forEach(line => {
        // Check if number
        if (line.match(/\d*\.\d*/g)) dataset.ourProteinMultiSet.push(parseFloat(line))
        else dataset.proteinOptions.push(line)
    })
    return dataset
}

const sampleDataSet = `
4
GSDMQS
VWICN
IASWMQS
PVSMGAD
445.17838
115.02694
186.07931
314.13789
317.1198
215.09061
`

function generateProteinSpectra(protein: string) {
    const massOptions: number[] = []
    for (let i = 0; i < protein.length; i++) {
        const proteinPart = protein.slice(i)
        const massOption = getMassOfProtein(proteinPart)
        massOptions.push(massOption)
    }
    return massOptions
}

// WARNING: almost definitly the incorrect solution, but it works, finds a difference ~ 0
if (import.meta.main) {
    const rawDataSet = Deno.args.length === 0
        ? sampleDataSet
        : Deno.readTextFileSync(Deno.args[0])

    const dataset = parseDataSet(rawDataSet)
    const proteinSpectraOptions = dataset.proteinOptions.map(protein => {
        return {
            protein,
            spectra: generateProteinSpectra(protein)
        }
    })
    const minkowSets = proteinSpectraOptions.map(option => {
        // Not sure if this works
        const minkowSet = generateMinkowskiDifference(new Set(dataset.ourProteinMultiSet), new Set(option.spectra))
        const mostCommonDiff = findLargestMultiplicity(minkowSet)
        return {
            ...option,
            mostCommonDiff
        }
    })
    const bestOption = minkowSets.reduce((prev, cur) => 
        cur.mostCommonDiff.numOccurances > prev.mostCommonDiff.numOccurances ? cur : prev
    )
    console.log(bestOption)
    console.log(bestOption.mostCommonDiff.numOccurances + "\n" + bestOption.protein)
}