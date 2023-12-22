require('./dirty-tricks')
const {printSolution, makeMatrix, sum} = require("./util");
const input = require('fs').readFileSync('./inputs/22.txt', 'utf-8')

const brickInputs = input.split('\n').map((l, i) => {
  const [start, end] = l.split('~').map(c => c.split(',').map(n => +n))
  return {
    start,
    end,
    id: i.toString(36),
    zOffset: 0,
    coords() {
      return brickCoordinates(this, this.zOffset)
    },
    originalCoords() {
      return brickCoordinates(this, 0)
    }
  }
})


const [xMax, yMax, zMax] = brickInputs
  .reduce(([xMax, yMax, zMax], {start: [sx, sy, sz], end: [ex, ey, ez]}) => {
    return [Math.max(xMax, sx, ex), Math.max(yMax, sy, ey), Math.max(zMax, sz, ez)]
  }, [0, 0, 0])

function* brickCoordinates({start: [x1, y1, z1], end: [x2, y2, z2]}, zOffset) {
  yield [x1, y1, z1 + zOffset]
  while (x1 < x2) yield [++x1, y1, z1 + zOffset]
  while (y1 < y2) yield [x1, ++y1, z1 + zOffset]
  while (z1 < z2) yield [x1, y1, ++z1 + zOffset]
}

brickInputs.sort((a, b) => {
  return Math.min(a.start[2], a.end[2]) - Math.min(b.start[2], b.end[2])
})

//console.log('sorted', brickInputs)

const brickMatrix = makeMatrix(xMax + 1, yMax + 1, () => new Array(zMax + 1))
brickInputs.forEach((brick) => {
  for (const [x, y, z] of brick.coords()) {
    brickMatrix[x][y][z] = brick.id
  }
})

brickInputs.forEach(brick => {
  const sup = supportedBy(brick, brickMatrix)
  const supIndex = sup.length ? sup[0][1] + 1 : 0
  brick.zOffset = supIndex - Math.min(brick.start[2], brick.end[2])
  for (const [x, y, z] of brick.originalCoords()) {
    delete brickMatrix[x][y][z]
  }
  for (const [x, y, z] of brick.coords()) {
    brickMatrix[x][y][z] = brick.id
  }
})

function supportedBy(brick, brickMatrix) {
  const res = []
  for (const [x, y, z] of brick.coords()) {
    for (let i = z - 1; i >= 0; i--) {
      const t = brickMatrix[x][y][i]
      if (t && t !== brick.id) {
        res.push([t, i])
        break
      }
    }
  }
  const max = res.reduce((acc, [, i]) => i > acc ? i : acc, 0)
  return res.filter(([, i]) => i === max)
}

const supported = brickInputs.reduce((acc, brick) => {
  acc[brick.id] = [...new Set(supportedBy(brick, brickMatrix).map(([id]) => id))]
  return acc
}, {})

const supporting = brickInputs.reduce((acc, brick) => {
  supportedBy(brick, brickMatrix).forEach(([id]) => {
    if (!acc[id]) acc[id] = new Set()
    acc[id].add(brick.id)
  })
  return acc
}, {})


const nonRemovableBricks = new Set(Object.entries(supported).filter(([,set])=> set.length === 1).map(([,set])=>set[0]))

console.log('solution1', brickInputs.length - nonRemovableBricks.size)

function countFallingBricks(id) {
  const queue = [...supporting[id]]
  const visited = new Set()
  let res = new Set([id])
  while (queue.length > 0) {
    const nextId = queue.pop()
    res.add(nextId)
    if (!visited.has(nextId)) {
      queue.push(...(supporting[nextId] ?? []))
      visited.add(nextId)
    }
  }
  let prevCount
  do {
    prevCount = res.size
    res = new Set([...res].filter(b => b === id || supported[b].every(c => res.has(c))))
  } while (res.size !== prevCount)
  res.delete(id)
  return res.size
}

console.log('solution2', [...nonRemovableBricks].map(countFallingBricks).reduce(sum))