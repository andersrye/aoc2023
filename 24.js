require('./dirty-tricks')
const {printSolution, sum} = require("./util");
const input = require('fs').readFileSync('./inputs/24.txt', 'utf-8')

const lines = input.split('\n').map(l => l.split('@').map(c => c.split(',').map(n => +n)))
const lines2d = lines.map(([[a, b], [c, d]]) => [[a, b], [c, d]])

function normalize(v) {
  const l = Math.sqrt(v.map(n => n * n).reduce(sum))
  return v.map(n => n / l)
}

function intersection([[px1, py1], v1], [[px2, py2], v2]) {
  const [vx1, vy1] = normalize(v1)
  const [vx2, vy2] = normalize(v2)
  const qx1 = (px2 - px1) * vx1 + (py2 - py1) * vy1;
  const qy1 = (px2 - px1) * -vy1 + (py2 - py1) * vx1;
  const sx1 = vx2 * vx1 + vy2 * vy1;
  const sy1 = vx2 * -vy1 + vy2 * vx1;
  const qx2 = (px1 - px2) * vx2 + (py1 - py2) * vy2;
  const qy2 = (px1 - px2) * -vy2 + (py1 - py2) * vx2;
  const sx2 = vx1 * vx2 + vy1 * vy2;
  const sy2 = vx1 * -vy2 + vy1 * vx2;
  if (sy1 === 0) return null;
  const a = qx1 - qy1 * sx1 / sy1;
  const b = qx2 - qy2 * sx2 / sy2;
  if (a < 0 || b < 0) return null
  return [px1 + a * vx1, py1 + a * vy1];
}

function countIntersectionsWithin(lines, min, max) {
  return lines.flatMap((p1, i) => lines.slice(i).map(p2 => {
    return intersection(p1, p2)
  })).reduce((acc, v) => v && v[0] <= max && v[0] >= min && v[1] <= max && v[1] >= min ? acc + 1 : acc, 0)
}
printSolution('solution1', ()=>{
  return countIntersectionsWithin(lines2d, 200000000000000, 400000000000000)
})