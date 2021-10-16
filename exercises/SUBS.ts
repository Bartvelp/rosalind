import fs from 'fs'

export function findSubstringLocations(needle: string, haystack: string): number[] {
    const locations: number[] = []
    let index = 0
    while (true) {
        index = haystack.indexOf(needle, index + 1)
        if (index == -1) break
        else locations.push(index)
    }
    return locations
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const [s, t] = fileContent.split('\n')

    const locations = findSubstringLocations(t, s)
    // Awnser expects them 1 indexed, so add 1 to all
    const awnser = locations.map(n => ++n)
    console.log(awnser.join(' '))
}