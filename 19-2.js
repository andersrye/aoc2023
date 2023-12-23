require('./dirty-tricks')
const {printSolution, sum, product} = require("./util");
const input = require('fs').readFileSync('./inputs/19.txt', 'utf-8')

const [workflowInput] = input.split('\n\n')

function parseCond(condString) {
  const [, letter, op, numberString] = condString.match(/(\w)([<>])(\d+)/)
  return [letter, op, parseInt(numberString)]
}

function parseWorkflow(string) {
  if (string.includes(':')) {
    const [condString, rest] = string.split(/:(.*)/)
    const [first, second] = rest.split(/,(.*)/)
    return {
      cond: parseCond(condString),
      yes: parseWorkflow(first),
      no: parseWorkflow(second),
    }
  } else {
    return string
  }
}

const workflows = workflowInput.split('\n')
  .map(s => s.match(/(\w+){(.*)}/))
  .reduce((acc, [, name, cmd]) => ({
    ...acc,
    [name]: parseWorkflow(cmd)
  }), {})

function search(workflows) {
  const stack = [[workflows['in'], []]]
  const result = []
  while (stack.length) {
    const item = stack.pop()
    const [{cond, yes, no}, path] = item
    if (typeof yes === 'object') {
      stack.push([yes, [...path, [cond, true]]])
    } else if (yes === 'A') {
      result.push([...path, [cond, true]])
    } else if (yes !== 'R') {
      stack.push([workflows[yes], [...path, [cond, true]]])
    }
    if (typeof no === 'object') {
      stack.push([no, [...path, [cond, false]]])
    } else if (no === 'A') {
      result.push([...path, [cond, false]])
    } else if (no !== 'R') {
      stack.push([workflows[no], [...path, [cond, false]]])
    }
  }
  return result
}

function findCombinations(acceptedWorkflow) {
  const ranges = {
    x: {min: 1, max: 4000},
    m: {min: 1, max: 4000},
    a: {min: 1, max: 4000},
    s: {min: 1, max: 4000}
  }
  acceptedWorkflow.forEach(([[letter, cond, number], decision]) => {
    if (decision && cond === '>') {
      ranges[letter].min = Math.max(ranges[letter].min, number + 1)
    } else if (!decision && cond === '<') {
      ranges[letter].min = Math.max(ranges[letter].min, number)
    } else if (decision && cond === '<') {
      ranges[letter].max = Math.min(ranges[letter].max, number - 1)
    } else if (!decision && cond === '>') {
      ranges[letter].max = Math.min(ranges[letter].max, number)
    }
  })
  return Object.values(ranges).map(({min, max}) => max - min + 1).reduce(product)
}

printSolution('solution2', () => search(workflows).map(findCombinations).reduce(sum))