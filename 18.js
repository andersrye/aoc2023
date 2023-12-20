require('./dirty-tricks')
const {printSolution, lcm, matrixToString} = require("./util");
const input = require('fs').readFileSync('./inputs/18.txt', 'utf-8')

const digPlan = input.split('\n').map(l => {
  const [, dir, count, color] = l.match(/(\w) (\d+) \(#(.+)\)/)
  return [dir, parseInt(count), color]
})

function* vertices(plan) {
  let y = 0, x = 0
  for (const [dir, count] of plan) {
    if (dir === 'U') y -= count
    if (dir === 'D') y += count
    if (dir === 'L') x -= count
    if (dir === 'R') x += count
    yield {x, y}
  }
}

function area(vertices) {
  let area = 0
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length
    area += vertices[i].x * vertices[j].y - vertices[i].y * vertices[j].x
  }
  return Math.abs(area) / 2
}

printSolution('solution1', () => {
  const boundaryPoints = digPlan.reduce((acc, [, count]) => acc + count, 0)
  const p = Array.from(vertices(digPlan))
  return area(p) + boundaryPoints / 2 + 1
})

const digPlan2 = digPlan.map(([, , color]) => [
    ({0: 'R', 1: 'D', 2: 'L', 3: 'U'})[color[color.length - 1]],
    parseInt(color.slice(0, 5), 16)
  ]
)

printSolution('solution2', () => {
  const boundaryPoints = digPlan2.reduce((acc, [, count]) => acc + count, 0)
  const p = Array.from(vertices(digPlan2))
  return area(p) + boundaryPoints / 2 + 1
})