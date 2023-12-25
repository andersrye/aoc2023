require('./dirty-tricks')
const input = require('fs').readFileSync('./inputs/04.txt', 'utf-8')

const scores = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512]

function intersection(arrayA, arrayB) {
  return arrayA.filter(a => arrayB.some(b => a === b))
}

const cards = input.split('\n')
  .map(line => {
    const [, winningNumbers, drawnNumbers] = line
      .split(/[:|]/)
      .map(l => l.matchAll(/\d+/g).map(m => parseInt(m[0])))
    return intersection(winningNumbers, drawnNumbers)
  })

const solution1 = cards.reduce((acc, val) => acc + scores[val.length], 0)

console.log('solution1', solution1)

const numCards = new Array(cards.length).fill(1)

for (const [index, val] of cards.entries()) {
  for (let i = index + 1; i < index + 1 + val.length; i++) {
    numCards[i] = numCards[i] + numCards[index]
  }
}

const solution2 = numCards.reduce((a, b) => a + b)

console.log('solution2', solution2)