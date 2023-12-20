require('./dirty-tricks')
const {printSolution, sum} = require("./util");
const input = require('fs').readFileSync('./examples/19.txt', 'utf-8')

const [workflowInput, partInput] = input.split('\n\n')

function parseCond(condString) {
  const [, letter, op, numberString] = condString.match(/(\w)([<>])(\d+)/)
  const number = parseInt(numberString)
  return (part) => {
    if (op === '<') {
      return part[letter] < number
    } else {
      return part[letter] > number
    }
  }
}

function parseWorkflow(string) {
  if (string.includes(':')) {
    const [condString, rest] = string.split(/:(.*)/)
    const [first, second] = rest.split(/,(.*)/)
    const cond = parseCond(condString)
    const onTrue = parseWorkflow(first)
    const onFalse = parseWorkflow(second)
    return (part) => {
      if (cond(part)) {
        return onTrue(part)
      } else {
        return onFalse(part)
      }
    }
  } else if (string === 'A') {
    return (part) => [true, part]
  } else if (string === 'R') {
    return (part) => [false, part]
  } else {
    return (part) => workflows[string](part)
  }
}

const workflows = workflowInput.split('\n')
  .map(s => s.match(/(\w+){(.*)}/))
  .reduce((acc, [, name, cmd]) => ({
    ...acc,
    [name]: parseWorkflow(cmd)
  }), {})

const parts = partInput.split('\n')
  .map(s => s.matchAll(/(\w)=(\d+)/g).reduce((acc, [, l, n]) => ({...acc, [l]: parseInt(n)}), {}))

const runWorkflows = workflows['in']

console.log('solution1', parts.map(p => runWorkflows(p))
  .filter(([accepted]) => accepted)
  .reduce((acc, [, part]) => acc + Object.values(part).reduce(sum), 0)
)