require('./dirty-tricks')
const {transpose, matrixToString, sum} = require("./util");
const input = require('fs').readFileSync('./inputs/13.txt', 'utf-8')

const maps = input.split('\n\n').map(l => l.split('\n').map(s => s.split('')))
function rowMismatches(line, startIndex) {
  let mismatchCount = 0
  for (let i = startIndex, j = startIndex + 1; true; i--, j++) {
    if (!line[i] || !line[j]) break
    if (line[i] !== line[j]) mismatchCount++
  }
  return mismatchCount
}

function mirroredAt(matrix, mismatchCount) {
  const mismatches = matrix.map(r => r.slice(0, -1).map((_, i) => rowMismatches(r, i)))
  const index = transpose(mismatches).findIndex(r => r.reduce(sum) === mismatchCount)
  if (index > -1) return index + 1
}

function mirrorScore2(matrix, mismatchCount) {
  const mirroredV = mirroredAt(matrix, mismatchCount)
  if (mirroredV) return mirroredV
  const transposed = transpose(matrix)
  const mirroredH = mirroredAt(transposed, mismatchCount)
  if (mirroredH) return mirroredH * 100
  throw Error(`not mirrored??\n${matrixToString(matrix)}`)
}

console.log('solution1', maps.map(m => mirrorScore2(m, 0)).reduce(sum))
console.log('solution2', maps.map(m => mirrorScore2(m, 1)).reduce(sum))