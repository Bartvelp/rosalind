// Sequence = [1, 5, 2, 4, 3]
// find longest for i
// [[1, 5], [5], [2, 4], [4], [3]]
// Real awnser = [1, 2, 4]
// Combining step?
//   orig_remaining = current.slice(1)
//   longest_remaining = current.slice(1)
//   start index = longest_remaining[0].index
//   for start_index < array.length
//      if el.length > longest_remaining.length
//          longest_remaining = el
// 
//   awnser[:-1] + longest_remaining

// [[1, 5], [5], [2, 4], [4], [3]]
// [1, 2, 4]
// new sequence = [1, 5, 8, 6, 3, 2, 7, 4]
// best [1, 5, 6, 7]
// first run = [[1,5,8], [5, 8], [8], [6, 7], [3, 7], [2, 7], [7], [4]]
// new sequence = [1,8,2,5,3,4,6,7]
// first run [[1,8], [8], [2, 5, 6, 7], [5, 6, 7], [3, 4, 6, 7], ...]
// Best == [1,2,3,4,6,7]
// new run = [1,2,5,6,7]
import fs from 'fs'
import child_process from 'child_process'

function findLongestSubsequence(sequence: number[], shouldIncrease = true) {
    let awnsers = singleRun(sequence, shouldIncrease)
    let lastAwnsers: number[][] = []
    while (JSON.stringify(awnsers) !== JSON.stringify(lastAwnsers)) {
        lastAwnsers = awnsers
        awnsers = lastAwnsers.map((subsequence, currI) => {
            if (subsequence.length === 1) return subsequence
            const origRemaining = subsequence.slice(1)
            let longestRemaining = origRemaining
    
            const startIndex = sequence.indexOf(longestRemaining[0])
            for (let i = currI; i < lastAwnsers.length; i++) {
                const el = lastAwnsers[i]
                if (el.length > longestRemaining.length) {
                    if (shouldIncrease && el[0] > subsequence[0]) longestRemaining = el
                    if (!shouldIncrease && el[0] < subsequence[0]) longestRemaining = el
                }
            }
            return [subsequence[0], ...longestRemaining]
        })
    }
    // Find longest entry
    const longestEntry = awnsers.reduce(function (prev, cur) {
        return (cur.length > prev.length) ? cur : prev;
      }, []);
    return longestEntry
}

export function singleRun(sequence: number[], shouldIncrease = true) {
    const possibleSubsequences = sequence.map((entry, i, sequence) => {
        const possibility = [entry]
        sequence.slice(i).forEach(newOption => {
            const lastEntry = possibility[possibility.length - 1]
            if (!shouldIncrease && newOption < lastEntry) possibility.push(newOption)
            if (shouldIncrease && newOption > lastEntry) possibility.push(newOption)
        })
        return possibility
    })
    return possibleSubsequences
}

export function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

function checkIfTheSame() {
    let num = 0
    while (true) {
        const sequence = shuffleArray([...Array(10000).keys()])

        const longestIncreasing = findLongestSubsequence(sequence, true)
        const longestDecreasing = findLongestSubsequence(sequence, false)
        fs.writeFileSync('./temp', sequence.length + '\n' + sequence.join(' '))
        const pythonOutput = child_process.execSync('/usr/bin/python /home/bart/Projects/node/rosalind/exercises/dna/lgis.py /home/bart/Projects/node/rosalind/temp')
        
        if (longestIncreasing.length < pythonOutput.toString('utf-8').split(' ').length) {
            console.log('Sequence', sequence.join(' '))
            console.log(longestIncreasing.join(' '))
            console.log(longestDecreasing.join(' '))
            break
        }
        console.log(num++, "times the same")
    }
}

if (require.main === module) {
    // const sequence - [0, 1, 6, 4, 2, 3, 5]
    const sequence = fs.readFileSync(process.argv[2], 'utf-8').split('\n')[1]
        .split(' ').map(e => parseInt(e))

    const longestIncreasing = findLongestSubsequence(sequence, true)
    console.log(longestIncreasing.join(' '))
    const longestDecreasing = findLongestSubsequence(sequence, false)
    console.log(longestDecreasing.join(' '))
    //*/
}