require('./dirty-tricks')
const {transpose, matrixToString, sum} = require("./util");
const input = require('fs').readFileSync('./inputs/13.txt', 'utf-8')

const maps = input.split('\n\n').map(l => l.split('\n').map(s => s.split('')))

function rowMirrored(line, startIndex, rowIndex) {
  let count = 0
  for (let i = startIndex, j = startIndex + 1; true; i--, j++, count++) {
    if (!line[i] || !line[j]) break
    if (line[i] !== line[j]) return false
  }
  return count > 0
}

function mirroredAt(matrix) {
  for (let i = 0; i < matrix[0].length; i++) {
    if (matrix.every((row, ri) => rowMirrored(row, i, ri))) {
      return i + 1
    }
  }
}

function mirrorScore(matrix) {
  const mirroredV = mirroredAt(matrix)
  if (mirroredV) return mirroredV
  const transposed = transpose(matrix)
  const mirroredH = mirroredAt(transposed)
  if (mirroredH) return mirroredH * 100
  throw Error(`not mirrored??\n${matrixToString(matrix)}`)
}

console.log('solution1', maps.map(mirrorScore).reduce(sum))