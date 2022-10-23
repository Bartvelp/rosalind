
type Edge = {
    parentNode: string;
    childNode: string;
    label: string;
}


function genAllSuffixes(sequence: string) {
    const allSuffixes = []
    for (let i = 1; i < sequence.length; i++)
        allSuffixes.push(sequence.slice(-1 * i))
    return allSuffixes
}

let curNodeI = 2
function getNewNodeName() {
    return `node${curNodeI++}`
}

function addEdgeToTree(tree: Edge[], char: string, parentNode: string) {
    const newNode = getNewNodeName()
    tree.push({
        parentNode,
        childNode: newNode,
        label: char
    })
    return newNode
}

function genSimpleSuffixTree(allSuffixes: string[]) {
    // Generate a suffixTree that is uncollapsed,
    // i.e. has nodes with degree 2
    const suffixTree: Edge[] = []
    for (const suffix of allSuffixes) {
        let curNode = 'node1'
        // Iterate over all prefixes of this suffix, and check if they are present in the Tree
        for (let i = 0; i < suffix.length; i++) {
            const prefix = suffix.slice(0, i + 1)
            const newNode = findSequenceNode(suffixTree, prefix, "node1")

            if (newNode === null) curNode = addEdgeToTree(suffixTree, prefix.at(-1) ?? '?', curNode)
            else curNode = newNode
        }
    }
    return suffixTree
}


function findSequenceNode(suffixTree: Edge[], sequence: string, startNode: string) {
    // Find the node associated with a certain sequence (a prefix of a suffix)
    let curNode = startNode
    const chars = sequence.split('')
    for (const char of chars) {
        const correctEdge = suffixTree.find(edge => {
            return edge.parentNode === curNode && edge.label === char
        })
        if (!correctEdge) return null
        curNode = correctEdge.childNode
    }
    return curNode
}

function collapseTree(simpleSuffixTree: Edge[]) {
    let curNode = "node2"
    let curEdge = simpleSuffixTree.find(edge => edge.childNode === curNode)
    if (!curEdge) return simpleSuffixTree

    const childEdges = simpleSuffixTree.filter(edge => edge.parentNode === curNode)
}

function makeRandomDNAstring(length: number) {
    let result = '';
    const characters = 'ACTG';
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}



const sampleDataSet = makeRandomDNAstring(999) + "$" // "ATAAATG$"
if (import.meta.main) {
    const sequence = Deno.args.length === 0
        ? sampleDataSet
        : Deno.readTextFileSync(Deno.args[0]).replaceAll('\n', '')
    
    const allSuffixes = genAllSuffixes(sequence)
    const simpleSuffixTree = genSimpleSuffixTree(allSuffixes)
    console.log(simpleSuffixTree)
}
