require('./dirty-tricks')
const {printSolution, makeMatrix, repeatMatrix} = require("./util");

const input = require('fs').readFileSync('./inputs/21.txt', 'utf-8')
const matrix = input.split('\n').map(line => line.split(''))

function search(matrix, maxSteps) {
  const startPos = [Math.floor(matrix.length / 2), Math.floor(matrix[0].length / 2)]
  const stack = [[startPos, 0]]
  const visited = new Set()
  const res = []
  while (stack.length > 0) {
    const [[y, x], steps] = stack.pop()
    const my = y % matrix.length + (y >= 0 ? 0 : matrix.length - 1)
    const mx = x % matrix[0].length + (x >= 0 ? 0 : matrix[0].length - 1)
    const id = `${y},${x},${steps}`
    if (matrix[my][mx] === '#') continue
    if (visited.has(id)) continue
    visited.add(id)
    if (steps === maxSteps) {
      res.push([y, x])
      continue
    }
    stack.push(
      [[y + 1, x], steps + 1],
      [[y - 1, x], steps + 1],
      [[y, x + 1], steps + 1],
      [[y, x - 1], steps + 1]
    )
  }
  return res
}

printSolution('solution1', () => search(matrix, 64).length)

printSolution('solution2', () => {
  const totalSteps = 26501365
  const boardWidth = matrix.length
  const gridSize = Math.floor(totalSteps / boardWidth)
  const multipliedMatrix = repeatMatrix(matrix, 5)

  const res = search(multipliedMatrix, boardWidth * 2 + Math.floor(boardWidth / 2))
  const groupByGrid = res.reduce((acc, [y, x]) => {
    const yf = Math.floor(y / boardWidth)
    const xf = Math.floor(x / boardWidth)
    acc[[yf, xf]] = (acc[[yf, xf]] ?? 0) + 1
    return acc
  }, {})
  const gridCounts = makeMatrix(5, 5, 0)
  Object.entries(groupByGrid).forEach(([k, v]) => {
    const [y, x] = k.split(',').map(n => +n)
    if (gridCounts[y]?.[x] !== undefined) gridCounts[y][x] = v
  })
  const [[, tls, t, trs], [, tlb, odd, trb], [l, , even, , r], [, blb, , brb], [, bls, b, brs]] = gridCounts
  return t + b + l + r
    + (gridSize ** 2) * odd
    + ((gridSize - 1) ** 2) * even
    + gridSize * (tls + trs + bls + brs)
    + (gridSize - 1) * (tlb + trb + blb + brb)
})