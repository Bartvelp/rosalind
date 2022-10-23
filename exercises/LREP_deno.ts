const sampleDataSet = `
CATACATAC$
2
node1 node2 1 1
node1 node7 2 1
node1 node14 3 3
node1 node17 10 1
node2 node3 2 4
node2 node6 10 1
node3 node4 6 5
node3 node5 10 1
node7 node8 3 3
node7 node11 5 1
node8 node9 6 5
node8 node10 10 1
node11 node12 6 5
node11 node13 10 1
node14 node15 6 5
node14 node16 10 1
`

type Edge = {
    parentLabel: string;
    childLabel: string;
    startLoc: number;
    length: number;
}

function parseDataset(rawDataset: string) {
    const lines = rawDataset.split('\n').filter(l => l.length > 0)
    const sequence = lines[0]
    const k = parseInt(lines[1])
    const edges: Edge[] = lines
        .slice(2)
        .map(edgeLine => {
            const edgeParts = edgeLine.split(' ')
            return {
                parentLabel: edgeParts[0],
                childLabel: edgeParts[1],
                startLoc: parseInt(edgeParts[2]),
                length: parseInt(edgeParts[3])
            }
        })
    
    return {
        sequence,
        k,
        suffixTree: edges
    }
}

function extractNodes(suffixTree: Edge[]) {
    // Find all internal and external nodes
    const nodeDegrees = new Map(suffixTree.map(edge => {
        return [edge.childLabel, 1]
    }))

    for (const edge of suffixTree) {
        const curCount = nodeDegrees.get(edge.parentLabel) ?? 0
        nodeDegrees.set(edge.parentLabel, curCount + 1)
    }

    const internalNodes:string[] = []
    const leafNodes:string[] = []
    for (const [nodeLabel, degree] of nodeDegrees.entries()) {
        if (degree === 2) console.warn("Found a node with degree 2??", nodeLabel)
        if (degree > 2) internalNodes.push(nodeLabel)
        else leafNodes.push(nodeLabel)
    }

    return {
        internalNodes,
        leafNodes
    }
}

function findPathOptions(suffixTree: Edge[], curNode: string) {
    const pathOptions = suffixTree.filter(edge => edge.parentLabel === curNode)
    return pathOptions
}

function findAllSuffixes(suffixTree: Edge[], internalNodes: string[], curNode = 'node1') {
    const allPathOptions = findPathOptions(suffixTree, curNode)

}

function findAllParentNodes(suffixTree: Edge[], curNode: string):string[] {
    const parentNodes = []
    for (const edge of suffixTree) {
        if (edge.childLabel === curNode) {
            // Found a parent
            parentNodes.push(edge.parentLabel)
            parentNodes.push(...findAllParentNodes(suffixTree, edge.parentLabel))
        }
    }
    return parentNodes
}

function findEdgesLeadingToRoot(suffixTree: Edge[], curNode: string):Edge[] {
    const edgesToRoot: Edge[] = []
    for (const edge of suffixTree) {
        if (edge.childLabel === curNode) {
            // Found the _only_ parent
            edgesToRoot.push(edge)
            edgesToRoot.push(...findEdgesLeadingToRoot(suffixTree, edge.parentLabel))
            break
        }
    }
    return edgesToRoot
}

function findNumTravelledNodes(suffixTree: Edge[], leafNodes: string[]) {
    const nodeNumTravelled = new Map(suffixTree.map(edge => {
        return [edge.childLabel, 0]
    }))
    for (const leafNode of leafNodes) {
        const parentNodes = findAllParentNodes(suffixTree, leafNode)
        console.log(leafNode, 'has', parentNodes, 'as parents')
        for (const parentNode of parentNodes) {
            const curCount = nodeNumTravelled.get(parentNode) ?? 0
            nodeNumTravelled.set(parentNode, curCount + 1)
        }
    }
    return nodeNumTravelled
}

function findSuffixes(suffixTree: Edge[], startNodes: string[], sequence: string) {
    return startNodes.map(startNode => {
        const parentEdges = findEdgesLeadingToRoot(suffixTree, startNode)
        // Now build up the string
        let suffix = ''
        for (const edge of parentEdges) {
            suffix += sequence.slice(edge.startLoc - 1, edge.startLoc + edge.length - 1)
        }
        return suffix
    })
}

// NOT WORKING FOR ONE BIT
if (import.meta.main) {
    const rawDataset = Deno.args.length === 0
        ? sampleDataSet
        : Deno.readTextFileSync(Deno.args[0])
    const dataset = parseDataset(rawDataset)
    const nodes = extractNodes(dataset.suffixTree)
    console.log(nodes)
    const numTravelledNodes = findNumTravelledNodes(dataset.suffixTree, nodes.leafNodes)
    const relevantNodes = [...numTravelledNodes.entries()]
        .filter(([_, numTravelled]) => numTravelled >= dataset.k)
        .map(([node, _]) => node)
    const suffixes = findSuffixes(dataset.suffixTree, relevantNodes, dataset.sequence)
    console.log(numTravelledNodes)
    console.log(relevantNodes)
    console.log(suffixes)
}
