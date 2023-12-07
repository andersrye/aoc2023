const fs = require('fs')
const input = fs.readFileSync('./inputs/06.txt', 'utf-8')

const [times, distances] = input
  .split('\n')
  .map(l => Array.from(l.matchAll(/\d+/g)).map(n => parseInt(n[0])))

function countWaysToWin(time, distance) {
  let count = 0
  for (let i = 0; true; i++) {
    if ((time - i) * i > distance) {
      count++
    } else if (count) {
      break
    }
  }
  return count
}

const solution1 = times
  .map((time, i) => countWaysToWin(time, distances[i]))
  .reduce((a, b) => a * b)

console.log('solution1', solution1)

const [time, distance] = input
  .split('\n')
  .map(l => Array.from(l.matchAll(/\d+/g)).join(""))
  .map(n => parseInt(n))

const solution2 = countWaysToWin(time, distance)

console.log('solution2', solution2)