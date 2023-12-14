function* iterateMatrix(matrix) {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      yield [matrix[i][j], [i, j]]
    }
  }
}

function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function matrixToString(map) {
  return map.map(l => l.map(n => n ? n : " ").join("")).join('\n')
}

const sum = (a, b) => a + b

const product = (a, b) => a * b

const count = (m) => (acc, v) => v === m ? acc + 1 : acc

module.exports = {
  iterateMatrix,
  matrixToString,
  transpose,
  sum,
  product,
  count
}