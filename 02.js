const input = require('fs').readFileSync('./inputs/02.txt', 'utf-8')

const maxVals = {
  red: 12,
  green: 13,
  blue: 14
}

function isValid(line) {
  return !Array.from(line.matchAll(/(\d+) (\w+)/g)).some(([, num, color]) => parseInt(num) > maxVals[color])
}

function getId(line) {
  return parseInt(line.match(/^Game (\d+)/)[1])
}

const solution1 = input.split('\n')
.filter(isValid)
.map(getId)
.reduce((a, v) => a + v)

console.log('solution1', solution1)

function getMaxVals(line) {
  return Array.from(line.matchAll(/(\d+) (\w+)/g)).reduce((acc, [, num, color]) => {
    acc[color] = Math.max(acc[color] ?? 0, parseInt(num))
    return acc
  }, {})
}

const solution2 = input.split('\n')
.map(getMaxVals)
.reduce((acc, val) => acc + Object.values(val).reduce((a, v) => a * v), 0)

console.log('solution2', solution2)