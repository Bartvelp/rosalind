const sampleDataSet = `
ATAGA
ATC
GAT
`

type Edge = [number, number, string]


function findLastPrefixParent(adjList: Edge[], prefix: string) {
    let curNode = 1
    for (let i = 0; i < prefix.length; i++) {
        const symbol = prefix[i];
        const presentEdge = adjList.find(edge => edge[0] === curNode && edge[2] === symbol)
        if (!presentEdge) return -1
        else curNode = presentEdge[1]
    }
    return curNode
}

function getNextAvailIndex(adjList: Edge[]): number {
    const curHighest = adjList
        .map(edge => edge[1])
        .sort((a, b) => a - b)
        .at(-1) ?? 1
    return curHighest + 1
}

function genTrieAdjList(strings: string[]) {
    const adjList: Edge[] = []

    strings.forEach(string => {
        let curNodeI = 1
        for (let i = 0; i < string.length; i++) {
            const prefix = string.slice(0, i + 1)
            const lastPrefixParent = findLastPrefixParent(adjList, prefix)
            if (lastPrefixParent === -1) {
                // We need to add an Edge
                const nextIndex = getNextAvailIndex(adjList)
                adjList.push([curNodeI, nextIndex, prefix.at(-1) ?? '?'])
                curNodeI = nextIndex
            } else {
                // We found an edge for this prefix, update curNodeI
                curNodeI = lastPrefixParent
            }
        }
    })
    return adjList
}


if (import.meta.main) {
    const dataset = Deno.args.length === 0
        ? sampleDataSet
        : Deno.readTextFileSync(Deno.args[0])
    const strings = dataset.split('\n').filter(l => !!l)

    const trie = genTrieAdjList(strings)
    trie.forEach(edge => console.log(edge.join(' ')))
}