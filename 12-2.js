require('./dirty-tricks')
const {sum, printSolution} = require("./util");
const input = require('fs').readFileSync('./inputs/12.txt', 'utf-8')

const parsed = input.split('\n').map(line => {
  const [a, b] = line.split(' ')
  return [a, b.split(',').map(n => parseInt(n))]
})

function memoize(fn) {
  const cache = {}
  return (...args) => {
    const k = args.toString()
    return cache[k] ?? (cache[k] = fn(...args))
  }
}

const countWays = memoize((string, validator) => {
  const trimmed = string.replace(/^\.+/, "")
  if (validator.length === 0 && trimmed.includes('#')) {
    return 0
  }
  if (trimmed.length === 0 && validator.length === 0) {
    return 1
  }
  if (trimmed.length === 0) {
    return 0
  }
  if (trimmed[0] === '?') {
    return countWays('#' + trimmed.slice(1), validator) + countWays('.' + trimmed.slice(1), validator)
  }

  const [, damaged, rest] = trimmed.match(/(^#+)?(.*)/)
  if (damaged?.length === validator[0]) {
    if (rest[0] === '?') {
      return countWays('.' + rest.slice(1), validator.slice(1))
    }
    return countWays(rest, validator.slice(1))
  }
  if (damaged && damaged.length > validator[0]) {
    return 0
  }
  if (damaged && damaged.length < validator[0]) {
    if (rest[0] === '?') {
      return countWays(string.replace(/\?/, "#"), validator)
    }
    return 0
  }
  if (!damaged) {
    return countWays(rest, validator)
  }
  throw Error('dette skal ikke skje')
})

printSolution('solution1', ()=> {
  return parsed.map(([string, groups]) => countWays(string, groups)).reduce(sum)
})

const parsedMultiplied = parsed.map(([string, groups]) => {
  return [
    [string, string, string, string, string].join('?'),
    groups.concat(groups, groups, groups, groups)
  ]
})

printSolution('solution2', () => {
  return parsedMultiplied.map(([string, groups], i) => countWays(string, groups)).reduce(sum)
})