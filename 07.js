const fs = require('fs')
const input = fs.readFileSync('./inputs/07.txt', 'utf-8')

const parsed = input.split('\n')
  .map(line => line.match(/(\w{5})\s(\d+)/))
  .map(match => [match[1], parseInt(match[2])])

const alphabet1 = "AKQJT98765432"

function compareHighCard(a, b, alphabet) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return alphabet.indexOf(b[i]) - alphabet.indexOf(a[i])
    }
  }
  return 0
}

function type(string) {
  return Object.values(string.split("").reduce((acc, c) => (acc[c] = (acc[c] ?? 0) + 1, acc), {}))
    .sort((a, b) => b - a)
    .join("")
}

function compareHands(alphabet) {
  return function ([typeA, handA], [typeB, handB]) {
    if (typeA > typeB) {
      return 1
    } else if (typeB > typeA) {
      return -1
    } else return compareHighCard(handA, handB, alphabet)
  }
}

const solution1 = parsed
  .map(a => [type(a[0]), ...a])
  .sort(compareHands(alphabet1))
  .reduce((acc, [, , bid], i) => acc + bid * (i + 1), 0)

console.log("solution1", solution1)

const alphabet2 = "AKQT98765432J"

function jokerType(string) {
  const {J = 0, ...freq} = string.split("").reduce((acc, c) => (acc[c] = (acc[c] ?? 0) + 1, acc), {})
  const type = Object.values(freq).sort((a, b) => b - a)
  type[0] = (type[0] ?? 0) + J
  return type.join("")
}

const solution2 = parsed
  .map(a => [jokerType(a[0]), ...a])
  .sort(compareHands(alphabet2))
  .reduce((acc, [, , bid], i) => acc + bid * (i + 1), 0)

console.log('solution2', solution2)