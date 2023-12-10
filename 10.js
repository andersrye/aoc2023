require('./dirty-tricks')
const input = require('fs').readFileSync('./inputs/10.txt', 'utf-8')
const map = input.split("\n").map(l => l.split(""))

const expanded = {
  'S': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  '|': [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  '-': [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'L': [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  'J': [
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  '7': [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 0],
  ],
  'F': [
    [0, 0, 0],
    [0, 1, 1],
    [0, 1, 0],
  ],
  '.': [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
}

function toString(map) {
  return map.map(l => l.map(n => n ? n : " ").join("")).join('\n')
}

function expandMap(map) {
  return map.flatMap(r => r.map(n => expanded[n]).reduce(([accA, accB, accC], [a, b, c]) => [[...accA, ...a], [...accB, ...b], [...accC, ...c]], [[], [], []]))
}

const expandedMap = expandMap(map)

function startPos(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'S') return [y, x]
    }
  }
}

function search(map, startPos, valid, pred) {
  const visited = new Set()
  const hist = []
  const stack = [startPos]
  while (stack.length) {
    const [y, x] = stack.pop()
    const val = map[y]?.[x]
    const id = `${y},${x}`
    if (!valid(val) || visited.has(id)) continue
    visited.add(id)
    hist.push([y, x])
    if (pred(val, hist, [y, x])) return hist
    stack.push([y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1])
  }
}

const [y, x] = startPos(map)
const path = search(expandedMap, [y * 3 + 1, x * 3 + 1], v => v, (_, h, [y2, x2]) => h.length > 3 && Math.floor(y2 / 3) === y && Math.floor(x2 / 3) === x)

console.log('solution1', Math.floor(path.length / 3 / 2))

console.log(toString(map), '\n')
const nonLoopTiles = new Array(map.length).fill(null).map(_ => new Array(map[0].length).fill(1))
path.forEach(([y, x]) => nonLoopTiles[Math.floor(y / 3)][Math.floor(x / 3)] = 0)

console.log(toString(nonLoopTiles), '\n')

const loopPipesOnly = map.map((r, y) => r.map((v, x) => nonLoopTiles[y][x] ? "." : v))

console.log(toString(loopPipesOnly), '\n')

const expandedLoopPipesOnly = expandMap(loopPipesOnly)

const insideOutsideMap = loopPipesOnly.map((r, y) => r.map((v, x) => {
  if (v === ".") {
    const res = search(expandedLoopPipesOnly, [y * 3, x * 3], val => !val, val => val === undefined)
    return res ? 'O' : 'I'
  } else {
    return '.'
  }
}))
console.log(toString(insideOutsideMap))
const solution2 = insideOutsideMap.reduce((acc, v) => acc + v.reduce((acc, c) => c === 'I' ? acc + 1 : acc, 0), 0)
console.log('solution2', solution2)