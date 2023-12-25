require('./dirty-tricks')
const {printSolution, sum, product} = require("./util");
const input = require('fs').readFileSync('./inputs/25.txt', 'utf-8')

const edges = input.split('\n').flatMap(line => {
  const [[v], other] = line.split(': ').map(p => p.split(' '))
  return other.map(o => [v, o])
})

function karger(edges) {
  let numVertices = new Set(edges.flat()).size
  while (numVertices > 2) {
    const [ra, rb] = edges[Math.floor(Math.random() * edges.length)]
    edges = edges.reduce((arr, [a, b]) => {
      if ((a === ra || a === rb) && (b === ra || b === rb)) {
        return arr
      }
      if (a === ra || a === rb) {
        arr.push([`${ra},${rb}`, b])
      } else if (b === ra || b === rb) {
        arr.push([a, `${ra},${rb}`])
      } else {
        arr.push([a, b])
      }
      return arr
    }, [])
    numVertices--
  }
  return edges
}

printSolution('solution1', ()=> {
  while (true) {
    const res = karger(edges)
    console.log('working!', res.length)
    if(res.length === 3) return res[0].map(s => s.split(',').length).reduce(product)
  }
})