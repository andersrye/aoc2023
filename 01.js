const fs = require('fs')
const input = fs.readFileSync('./inputs/01.txt', 'utf-8')

const solution1 = input
.split('\n')
.map(line => parseInt(line.match(/^\D*(\d)/)[1] + line.match(/(\d)\D*$/)[1]))
.reduce((v, a) => v + a)

console.log('solution1', solution1)

const first = /(\d|one|two|three|four|five|six|seven|eight|nine).*$/
const last = /^.*(\d|one|two|three|four|five|six|seven|eight|nine)/
const numbers = {
  one: '1', two: '2', three: '3',
  four: '4', five: '5', six: '6',
  seven: '7', eight: '8', nine: '9',
}

function toNum(match) {
  return numbers[match] ?? match
}

const solution2 = input
  .split('\n')
  .map(line => parseInt(toNum(line.match(first)[1]) + toNum(line.match(last)[1])))
  .reduce((v, a) => v + a)

console.log('solution2', solution2)