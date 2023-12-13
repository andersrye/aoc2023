require('./dirty-tricks')
const fs = require('fs')
const {matrixToString, transpose, iterateMatrix} = require("./util")

const input = fs.readFileSync('./inputs/11.txt', 'utf-8')
const universe = input.split('\n')
  .map(r=>r.split(""))

function expand(universe, n) {
  const expandRows = u => u.map((row,_,arr) => row.every(c => c !== '#') ? new Array(arr.length).fill(n) : row)
  return expandRows(transpose(expandRows(universe)))
}

function getPath([[y1,x1], [y2,x2]]) {
  const path = []
  for (let i = y1; i !== y2 ; y1 < y2 ? i++ : i--) {
    path.push([i,x1])
  }
  for (let j = x1; j !== x2 ; x1 < x2 ? j++ : j--) {
    path.push([y2,j])
  }
  return path
}


function totalDistances(universe) {
  return iterateMatrix(universe)
    .filter(([v]) => v === '#')
    .reduce((acc, [_,coords], i) => [...acc,coords],[])
    .flatMap((v1, i, arr) => arr.slice(i+1).map(v2 => [v1,v2]))
    .map(getPath)
    .map(path => path.map(([y,x]) => universe[y][x]))
    .map(path => path.reduce((acc, val) => typeof val === 'number' ? acc+val:acc+1, 0))
    .reduce((a,b) => a+b)
}

const expandedUniverse = expand(universe, 2)
console.log('solution1', totalDistances(expandedUniverse))

const expandedUniverse2 = expand(universe, 1000000)
console.log('solution2', totalDistances(expandedUniverse2))