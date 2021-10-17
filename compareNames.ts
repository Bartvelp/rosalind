import fs from 'fs'

/*
allEls = [...document.querySelectorAll("body > div.container.main > table > tbody > tr > td:nth-child(1)")]
allNames = allEls.map(el => el.innerText)
completedNames = allNames.slice(0, 37 + 1)
JSON.stringify(completedNames)
*/
const webNames: string[] = JSON.parse('["DNA","RNA","REVC","FIB","GC","HAMM","IPRB","PROT","SUBS","CONS","FIBD","GRPH","IEV","LCSM","LIA","MPRT","MRNA","ORF","PERM","PRTM","REVP","SPLC","LEXF","LGIS","LONG","PMCH","PPER","PROB","SIGN","SSEQ","TRAN","TREE","CAT","CORR","INOD","KMER","KMP","MMCH"]')
const localNames = fs.readdirSync('./exercises').map(fn => fn.split('.')[0])
const diff = webNames.filter(name => !localNames.includes(name))
console.log(diff)