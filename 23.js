require('./dirty-tricks')
const {PriorityQueue} = require("@datastructures-js/priority-queue")
const {printSolution} = require("./util");
const input = require('fs').readFileSync('./inputs/23.txt', 'utf-8')

const matrix = input.split('\n').map(l => l.split(''))
const startPos = [0, 1]
const endPos = [matrix.length - 1, matrix[0].length - 2]

function search(matrix, startPos, targetCondition) {
  const stack = [[startPos, 0, new Set()]]
  const targets = []
  let maxSteps = 0
  while (stack.length > 0) {
    const [[y, x], steps, visited] = stack.pop()
    const tile = matrix[y]?.[x]
    if (tile === undefined || tile === '#') {
      continue
    }
    const id = `${x},${y}`
    if (visited.has(id)) continue
    if (steps > 0 && targetCondition([y, x])) {
      targets.push([[y, x], steps])
      continue
    }
    const newVisited = new Set(visited)
    newVisited.add(id)
    if (steps > maxSteps) maxSteps = steps
    if (tile === '>') {
      stack.push([[y, x + 1], steps + 1, newVisited])
    } else if (tile === '^') {
      stack.push([[y - 1, x], steps + 1, newVisited])
    } else if (tile === 'v') {
      stack.push([[y + 1, x], steps + 1, newVisited])
    } else if (tile === '<') {
      stack.push([[y, x - 1], steps + 1, newVisited])
    } else {
      stack.push(
        [[y - 1, x], steps + 1, newVisited],
        [[y + 1, x], steps + 1, newVisited],
        [[y, x - 1], steps + 1, newVisited],
        [[y, x + 1], steps + 1, newVisited]
      )
    }
  }
  return targets
}

const vertices = {}

for (let y = 0; y < matrix.length; y++) {
  for (let x = 0; x < matrix[0].length; x++) {
    if (matrix[y][x] === '#') continue
    const count = [[y + 1, x], [y - 1, x], [y, x + 1], [y, x - 1]].map(([y, x]) => matrix[y]?.[x]).filter(t => t === undefined || t === '#').length
    if (count !== 2) vertices[[y, x].toString()] = {pos: [y, x]}
  }
}
for (const {pos} of Object.values(vertices)) {
  const vertexId = pos.toString()
  const targets = search(matrix, pos, pos => vertices[pos.toString()])
  vertices[vertexId].outbound = targets.map(([tPos, steps]) => ({vertex: tPos.toString(), cost: steps}))
  targets.forEach(([tPos, steps]) => {
    vertices[tPos].inbound = [...(vertices[tPos].inbound ?? []), {vertex: vertexId, cost: steps}]
  })
}

function graphSearch(graph, start, bothWays = false) {
  const queue = new PriorityQueue(([, s1], [, s2]) => s2 > s1 ? 1 : -1)
  const distances = {}
  queue.enqueue([start, 0, new Set()])
  while (!queue.isEmpty()) {
    const [vertexId, steps, visited] = queue.pop()
    //if(distances[vertexId]??0 > steps) {
    //  continue
    //}
    distances[vertexId] = Math.max(steps, distances[vertexId] ?? 0)
    if (visited.has(vertexId)) continue
    const newVisited = new Set(visited)
    newVisited.add(vertexId)
    const next = [
      ...graph[vertexId].outbound,
      ...(bothWays ? (graph[vertexId].inbound ?? []) : [])
    ].map(({vertex, cost}) => [vertex, steps + cost, newVisited])
    next.forEach(n => queue.enqueue(n))
  }
  return distances
}

printSolution('solution1', () => {
  return graphSearch(vertices, startPos.toString())[endPos.toString()]
})
printSolution('solution2', () => {
  return graphSearch(vertices, startPos.toString(), true)[endPos.toString()]
})
