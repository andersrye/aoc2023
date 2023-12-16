require('./dirty-tricks')
const {sum} = require("./util");
const input = require('fs').readFileSync('./examples/15.txt', 'utf-8')

const inputs = input.split(',')

function hash(string) {
  return string.reduce((acc, c) => ((acc + c.charCodeAt(0)) * 17) % 256, 0)
}

console.log('solution1', inputs.map(hash).reduce(sum))

const boxes = inputs
  .map(c => c.match(/(\w+)([=-])(\d?)/).slice(1, 4))
  .reduce((acc, [label, op, fl]) => {
    const h = hash(label)
    if (!acc[h]) acc[h] = {}
    if (op === '-') {
      delete acc[h][label]
    } else if (op === '=') {
      acc[h][label] = fl
    }
    return acc
  }, {})  

console.log(boxes)

const solution2 = Object.entries(boxes).reduce((acc, [box, contents]) => {
  const boxNum = parseInt(box)
  return acc + Object.entries(contents).reduce((acc, [label, fl], i) => {
    return acc + (boxNum + 1) * (i + 1) * parseInt(fl)
  }, 0)
}, 0)

console.log('solution2', solution2)