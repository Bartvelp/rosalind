
export type Edge = {
    parentNode: string;
    childNode: string;
    label: string;
}


export function genAllSuffixes(sequence: string) {
    const allSuffixes = []
    for (let i = 0; i < sequence.length; i++)
        allSuffixes.push(sequence.slice(-1 * i))
    return allSuffixes
}

let curNodeI = 2
function getNewNodeName() {
    return `node${curNodeI++}`
}

export function makeRandomDNAstring(length: number, alphabet = 'ACTG') {
    let result = '';
    const characters = alphabet;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function findNumMatchingChars(sequenceA: string, sequenceB: string) {
    let numMatching = 0
    for (let i = 0; i < sequenceA.length; i++) {
        if (sequenceA[i] !== sequenceB[i]) break
        else numMatching++
    }
    return numMatching
}

type MatchingPrefix = {
    matchingEdge: Edge | null,
    numMatching: number,
    numMatchingInLastEdge: number | null
}

function findMatchingPrefix(tree: Edge[], sequence: string, startNode = 'node1'): MatchingPrefix {
    let numMatching = 0
    let curEdge: Edge | null = null;

    for (let i = 0; i < tree.length; i++) {
        curEdge = tree[i];
        if (curEdge.parentNode !== startNode) continue
        numMatching = findNumMatchingChars(sequence, curEdge.label)
        if (numMatching > 0) {
            // console.log('Found matching edge', sequence, curEdge, numMatching)
            // Also add the number of matching chars of the children, if we match this entire edge
            const matchInChildren = (numMatching === curEdge.label.length)
              ? findMatchingPrefix(tree, sequence.slice(numMatching), curEdge.childNode)
              : { numMatching: 0, numMatchingInLastEdge: null, matchingEdge: null }

            numMatching += matchInChildren.numMatching
            // Return the edge of the child, unless we have no matches in the children
            let numMatchingInLastEdge = null
            if (matchInChildren.numMatchingInLastEdge) numMatchingInLastEdge = matchInChildren.numMatchingInLastEdge
            else if (!matchInChildren.matchingEdge) numMatchingInLastEdge = numMatching

            return {
                numMatching,
                matchingEdge: matchInChildren.matchingEdge ? matchInChildren.matchingEdge : curEdge,
                numMatchingInLastEdge
            }
        }
    }

    return {
        matchingEdge: numMatching !== 0 ? curEdge : null,
        numMatching,
        numMatchingInLastEdge: null
    }
}

export function genTree(allSuffixes: string[]) {
    const tree: Edge[] = []
    for (const suffix of allSuffixes) {
        // Check whether we need to add an Edge
        const match = findMatchingPrefix(tree, suffix)
        if (match.numMatching === suffix.length) {
            console.log('No new edge needed for suffix: ', suffix) // We matched the entire string, weird...
            continue
        }
        // If there is no match at all, add the entire suffix as an edge
        if (match.matchingEdge === null) {
            const newEdge: Edge = {
                parentNode: 'node1',
                childNode: getNewNodeName(),
                label: suffix
            }
            tree.push(newEdge)
            continue
        }
        // Check if we need to split an Edge, or just add one as a child
        if (match.matchingEdge.label.length === match.numMatchingInLastEdge) {
            // The entire last edge matches, so just add a child to it's child node
            const newEdge: Edge = {
                parentNode: match.matchingEdge.childNode,
                childNode: getNewNodeName(),
                label: suffix.slice(match.numMatching)
            }
            tree.push(newEdge)
            continue
        }
        if (match.numMatchingInLastEdge === null) throw new Error("Cannot have a match with no matches")
        // Okay we need to split an Edge, luckely we got a ref to the Edge in the tree, so no copy pastes

        /* How to split an edge
        // AGA => A.GA + A.TA
        orig: {parentNode: 'origParent', childNode: 'origChild', label: 'AGA'},
        =>
        coupler: {parentNode: 'origParent', childNode: 'coupler', label: 'A'},
        couplerOrig: {parentNode: 'coupler', childNode: 'origChild', label: 'GA'},
        couplerNew {parentNode: 'coupler', childNode: 'newSuffixChild', label: 'TA'},

        */
        const couplerLabel = match.matchingEdge.label.slice(0, match.numMatchingInLastEdge)
        // Now create 2 new childnodes
        const couplerOrigLabel = match.matchingEdge.label.slice(match.numMatchingInLastEdge)
        const couplerNewLabel = suffix.slice(match.numMatching)
        // Build the new edges
        const origChildName = match.matchingEdge.childNode
        const couplerName = getNewNodeName()
        const couplerNewName = getNewNodeName()

        // orig => coupler
        match.matchingEdge.childNode = couplerName
        match.matchingEdge.label = couplerLabel

        const couplerOrig: Edge = {
            parentNode: couplerName,
            childNode: origChildName,
            label: couplerOrigLabel
        }
        
        const couplerNew: Edge = {
            parentNode: couplerName,
            childNode: couplerNewName,
            label: couplerNewLabel
        }

        tree.push(couplerOrig, couplerNew)
    }
    return tree
}

export function testFindMatchingPrefix() {
    const testTree: Edge[] = [
        // A.ACAAT, A.T, G.AG.CAA
        {parentNode: 'node1', childNode: 'node2', label: 'AA'},
        {parentNode: 'node2', childNode: 'node3', label: 'TG$'},
        {parentNode: 'node2', childNode: 'node4', label: 'G$'},
    ]
    console.log(findMatchingPrefix(testTree, "ATG$"))
}

const sampleDataSet = makeRandomDNAstring(7 * 1000) + "$"
if (import.meta.main) {
    const sequence = Deno.args.length === 0
        ? sampleDataSet
        : Deno.readTextFileSync(Deno.args[0]).replaceAll('\n', '')
    
    const allSuffixes = genAllSuffixes(sequence)
    const tree = genTree(allSuffixes)
    const allEdgeLabels = tree.map(edge => edge.label)
    console.log(allEdgeLabels.join('\n'))

}
