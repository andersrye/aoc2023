const fs = require('fs')
const input = fs.readFileSync('./inputs/08.txt', 'utf-8')

const [instructions, , ...nodes] = input.split('\n')
const map = nodes
  .map(line => line.match(/^(\w{3})\W+(\w{3})\W+(\w{3})/))
  .reduce((acc, [, n, r, l]) => (acc[n] = [r, l], acc), {})

function countSteps(location, pred) {
  let steps = 0
  for (let i = 0; true; i++) {
    if (i === instructions.length) i = 0
    const instruction = instructions[i] === 'L' ? 0 : 1
    location = map[location][instruction]
    steps++
    if (pred(location)) break
  }
  return steps
}

const solution1 = countSteps('AAA', l => l === 'ZZZ')

console.log('solution1', solution1)

function gcd(a, b) {
  return !b ? a : gcd(b, a % b)
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

const solution2 = Object.keys(map)
  .filter(l => l[2] === 'A')
  .map(loc => countSteps(loc, l => l[2] === 'Z'))
  .reduce(lcm)

console.log('solution2', solution2)