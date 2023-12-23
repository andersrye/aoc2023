require('./dirty-tricks')
const {sum} = require("./util");
const input = require('fs').readFileSync('./inputs/12.txt', 'utf-8')

const parsed = input.split('\n').map(line => {
  const [a,b] = line.split(' ')
  return [a, b.split(',').map(n=>parseInt(n))]
})

function valid(string, validator) {
  let count = 0
  let validatorIndex = 0
  for (const c of string) {
    if(c === '?') {
      return
    } else if(c === '.') {
      if(count > 0) {
        if(count === validator[validatorIndex]) {
          validatorIndex++
        } else {
          return false
        }
      }
      count = 0
    } else if(c === '#') {
      if(++count > validator[validatorIndex]) return false
    }
  }
  if(count > 0) {
    if(count === validator[validatorIndex]) {
      validatorIndex++
    } else {
      return false
    }
  }
  return validator.length === validatorIndex
}
function searchSolutions([string, validator]) {
  const queue = [string]
  let res = 0
  while(queue.length > 0) {
    const val = queue.pop()
    const r = valid(val, validator)
    if(r === true) {
      res++
    } else if(r === undefined) {
      queue.push(val.replace(/\?/, "."), val.replace(/\?/, "#"))
    }
  }
  return res
}

console.log('solution1', parsed.map(searchSolutions).reduce(sum))