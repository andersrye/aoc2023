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

function makeMatrix(h, w, val = undefined) {
  const fn = typeof val !== "function" ? () => val : val
  return new Array(h).fill(null).map(_ => new Array(w).fill(null).map(fn))
}

function repeatMatrix(matrix, times) {
  const res = new Array(matrix.length*times)
  for (let i = 0; i < res.length; i++) {
    res[i] = new Array(matrix[0].length*times)
    for (let j = 0; j < res[i].length; j++) {
      res[i][j] = matrix[i%matrix.length][j%matrix.length]
    }
  }
  return res
}

const sum = (a, b) => a + b

const product = (a, b) => a * b

const count = (m) => (acc, v) => v === m ? acc + 1 : acc

const printSolution = (name, fn) => {
  const start = process.hrtime.bigint()
  const res = fn()
  const end = process.hrtime.bigint()
  console.log(`${name} =`, res, `in ${(Number(end - start) / 1000000000).toFixed(2)}s`)
}

function gcd(a, b) {
  return !b ? a : gcd(b, a % b)
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

module.exports = {
  iterateMatrix,
  matrixToString,
  transpose,
  sum,
  product,
  count,
  printSolution,
  gcd,
  lcm,
  makeMatrix,
  repeatMatrix
}