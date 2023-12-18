require('./dirty-tricks')
const {PriorityQueue} = require("@datastructures-js/priority-queue")

const input = require('fs').readFileSync('./inputs/17.txt', 'utf-8')
const matrix = input.split('\n').map(l => l.split('').map(n => parseInt(n)))

function calculateDistances(matrix, startPos, minMoves, maxMoves) {
  const queue = new PriorityQueue(([, acc1], [, acc2]) => acc1 > acc2 ? 1 : -1) //TODO: lag en egen priority queue...
  queue.enqueue([startPos, 0])
  const distances = new Array(matrix.length).fill(null).map(_ => new Array(matrix[0].length).fill(null).map(_ => ({})))
  while (!queue.isEmpty()) {
    const [[y, x], acc, prevDir, dirCount] = queue.pop()
    const dirKey = `${prevDir},${dirCount}`
    if (acc < (distances[y][x][dirKey] ?? Infinity)) {
      distances[y][x][dirKey] = acc
    } else continue
    [[[y + 1, x], 'd'], [[y - 1, x], 'u'], [[y, x + 1], 'r'], [[y, x - 1], 'l']].forEach(([[y, x], dir]) => {
      if (!(dir === prevDir && dirCount === maxMoves || dir !== prevDir && dirCount < minMoves)
        && y >= 0 && x >= 0 && y < matrix.length && x < matrix[0].length
        && !(dir === 'd' && prevDir === 'u')
        && !(dir === 'u' && prevDir === 'd')
        && !(dir === 'l' && prevDir === 'r')
        && !(dir === 'r' && prevDir === 'l')) {
        queue.enqueue([[y, x], acc + matrix[y][x], dir, dir === prevDir ? dirCount + 1 : 1])
      }
    })
  }
  return distances.map(r => r.map(c =>
    Object.entries(c)
      .filter(([k]) => parseInt(k.split(',')[1]) >= minMoves)
      .reduce((acc, [, v]) => acc < v ? acc : v, Infinity)))
}

console.log('solution1', calculateDistances(matrix, [0, 0], 1, 3)[matrix.length - 1][matrix[0].length - 1])
console.log('solution2', calculateDistances(matrix, [0, 0], 4, 10)[matrix.length - 1][matrix[0].length - 1])