require('./dirty-tricks')
const input = require('fs').readFileSync('./inputs/14.txt', 'utf-8')

const matrix1 = input.split('\n').map(line => line.split(''))
const matrix2 = structuredClone(matrix1)

function tiltN(matrix) {
  for (let y = 1; y < matrix.length; y++) {
    for (let x = 0; x < matrix[0].length; x++) {
      const c = matrix[y][x]
      if (c !== 'O') continue
      for (let i = y - 1; i >= -1; i--) {
        if (i === -1 || matrix[i][x] !== '.') {
          matrix[y][x] = matrix[i + 1][x]
          matrix[i + 1][x] = c
          break
        }
      }
    }
  }
}

function tiltS(matrix) {
  for (let y = matrix.length - 2; y >= 0; y--) {
    for (let x = 0; x < matrix[0].length; x++) {
      const c = matrix[y][x]
      if (c !== 'O') continue
      for (let i = y + 1; i <= matrix.length; i++) {
        if (i === matrix.length || matrix[i][x] !== '.') {
          matrix[y][x] = matrix[i - 1][x]
          matrix[i - 1][x] = c
          break
        }
      }
    }
  }
}

function tiltW(matrix) {
  for (let x = 1; x < matrix[0].length; x++) {
    for (let y = 0; y < matrix.length; y++) {
      const c = matrix[y][x]
      if (c !== 'O') continue
      for (let i = x - 1; i >= -1; i--) {
        if (i === -1 || matrix[y][i] !== '.') {
          matrix[y][x] = matrix[y][i + 1]
          matrix[y][i + 1] = c
          break
        }
      }
    }
  }
}

function tiltE(matrix) {
  for (let x = matrix[0].length - 2; x >= 0; x--) {
    for (let y = 0; y < matrix.length; y++) {
      const c = matrix[y][x]
      if (c !== 'O') continue
      for (let i = x + 1; i <= matrix[0].length; i++) {
        if (i === matrix[0].length || matrix[y][i] !== '.') {
          matrix[y][x] = matrix[y][i - 1]
          matrix[y][i - 1] = c
          break
        }
      }
    }
  }
}

function cycle(matrix) {
  tiltN(matrix)
  tiltW(matrix)
  tiltS(matrix)
  tiltE(matrix)
  return matrix
}

function weight(matrix) {
  let w = 0
  for (let i = matrix.length - 1; i >= 0; i--) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'O') w += matrix.length - i
    }
  }
  return w
}

tiltN(matrix1)

console.log('solution1', weight(matrix1))

const weights = []
for (let i = 0; i < 250; i++) {
  cycle(matrix2)
  weights.push(weight(matrix2))
}

console.log('solution2', weights[204 + 999999999 % 34])