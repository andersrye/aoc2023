require('./dirty-tricks')
const {sum} = require("./util");
const input = require('fs').readFileSync('./inputs/09.txt', 'utf-8')

const parsed = input.split('\n').map(l => l.matchAll(/-?\d+/g).map(n => parseInt(n)))

function diffs(nums) {
  const res = [nums]
  while (nums.some(Boolean)) {
    nums = nums.reduce((acc, n, i, a) => a[i + 1] != null ? [...acc, a[i + 1] - n] : acc, [])
    res.push(nums)
  }
  return res
}

function nextNumber(diffs) {
  return diffs.reverse().reduce((acc, d) => d[d.length - 1] + acc, 0)
}

console.log('solution1', parsed.map(diffs).map(nextNumber).reduce(sum))

function previousNumber(diffs) {
  return diffs.reverse().reduce((acc, d) => d[0] - acc, 0)
}

console.log('solution2', parsed.map(diffs).map(previousNumber).reduce(sum))
