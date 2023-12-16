require('./dirty-tricks')
const {sum} = require("./util");
const input = require('fs').readFileSync('./inputs/16.txt', 'utf-8')

const matrix = input.split('\n').map(l => l.split(''))

function next(matrix, dir, [y, x]) {
  const c = matrix[y][x]
  if (dir === 'u') {
    if (c === '.') return [['u', [y - 1, x]]]
    if (c === '|') return [['u', [y - 1, x]]]
    if (c === '-') return [['l', [y, x - 1]], ['r', [y, x + 1]]]
    if (c === '\\') return [['l', [y, x - 1]]]
    if (c === '/') return [['r', [y, x + 1]]]
  } else if (dir === 'd') {
    if (c === '.') return [['d', [y + 1, x]]]
    if (c === '|') return [['d', [y + 1, x]]]
    if (c === '-') return [['l', [y, x - 1]], ['r', [y, x + 1]]]
    if (c === '\\') return [['r', [y, x + 1]]]
    if (c === '/') return [['l', [y, x - 1]]]
  } else if (dir === 'l') {
    if (c === '.') return [['l', [y, x - 1]]]
    if (c === '|') return [['u', [y - 1, x]], ['d', [y + 1, x]]]
    if (c === '-') return [['l', [y, x - 1]]]
    if (c === '\\') return [['u', [y - 1, x]]]
    if (c === '/') return [['d', [y + 1, x]]]
  } else if (dir === 'r') {
    if (c === '.') return [['r', [y, x + 1]]]
    if (c === '|') return [['u', [y - 1, x]], ['d', [y + 1, x]]]
    if (c === '-') return [['r', [y, x + 1]]]
    if (c === '\\') return [['d', [y + 1, x]]]
    if (c === '/') return [['u', [y - 1, x]]]
  }
  throw Error(`oops! ${dir} ${y},${x} ${c}`)
}

function countEnergized(matrix, startPos) {
  const energized = new Array(matrix.length).fill(null).map(_ => new Array(matrix[0].length).fill(0))
  const visited = new Set()
  const queue = [startPos]
  while (queue.length > 0) {
    const [dir, [y, x]] = queue.pop()
    const id = `${dir},${x},${y}`
    if (!visited.has(id) && matrix[y]?.[x]) {
      energized[y][x]++
      visited.add(id)
      Array.prototype.push.apply(queue, next(matrix, dir, [y, x]))
    }
  }
  return energized.map(row => row.reduce((acc, v) => v > 0 ? acc + 1 : acc, 0)).reduce(sum)
}

const solution1 = countEnergized(matrix, ['r', [0, 0]])
console.log('solution1', solution1)

const solution2 = [
  matrix[0].map((_, i) => ['u', [matrix[0].length, i]]),
  matrix[0].map((_, i) => ['d', [0, i]]),
  matrix.map((_, i) => ['r', [i, 0]]),
  matrix.map((_, i) => ['l', [i, matrix.length]]),
].flat().map(pos => countEnergized(matrix, pos))

console.log('solution2', Math.max.apply(null, solution2))