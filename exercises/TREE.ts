import fs from 'fs'
type Edge = [string, string]

function parseEdges(fileContent: string): [Edge[], number] {
    const lines = fileContent.split('\n')
    const edges: Edge[] = lines.slice(1).map(line => line.split(' ') as Edge)
    return [edges, parseInt(lines[0])]
}

function calcConnectedGraphs(edges: Edge[]) {
    const groups: string[][] = [] // List of connected graphs
    edges.forEach(edge => {
        const originGroup = groups.find(group => group.includes(edge[0]))
        const targetGroup = groups.find(group => group.includes(edge[1]))
        if (originGroup && targetGroup) { // Combine both groups
            originGroup.push(...targetGroup)
            groups.splice(groups.indexOf(targetGroup), 1) // Remove target group
        } else if (originGroup) originGroup.push(edge[1])
        else if (targetGroup) targetGroup.push(edge[0])
        else groups.push(edge) // Init new group
    })
    return groups
}

if (require.main === module) {
    const fileContent = fs.readFileSync(process.argv[2], 'utf-8')
    const [edges, numNodes] = parseEdges(fileContent)
    const connectedGraphs = calcConnectedGraphs(edges)
    const numConnectedNodes = connectedGraphs.reduce((acc, group) => acc + group.length, 0)
    const numNeededEdges = connectedGraphs.length - 1 + (numNodes - numConnectedNodes)
    console.log(numNeededEdges)
}