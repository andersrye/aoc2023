require('./dirty-tricks')
const fs = require('fs')
const input = fs.readFileSync('./inputs/12.txt', 'utf-8')

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
function searchSolutions([string, validator], i) {
  //console.log(string, validator.join())
  //console.log(i+1, 'maxcount', Math.pow(2, string.reduce((acc,v) => v==='?' ? acc+1 : acc, 0)))
  const queue = [string]
  let res = 0
  let iters = 0
  while(queue.length > 0) {
    const val = queue.pop()
    const r = valid(val, validator)
    //console.log(queue.length, 'val',val, r)
    if(r === true) {
      res++
    } else if(r === undefined) {
      queue.push(val.replace(/\?/, "."), val.replace(/\?/, "#"))
    }
    iters++
  }
  //console.log('done!', iters, res)
  return res
}

console.log('solution1', parsed.map(searchSolutions).reduce((a,b) => a+b, 0))

//TODO...:
//const parsed2 = input.split('\n').map(line => {
//  const [a,b] = line.split(' ')
//  b.split(',').map(n=>parseInt(n))
//  return [
//    new Array(5).fill(a).join('?'),
//    new Array(5).fill(b.split(',').map(n=>parseInt(n))).flat()
//  ]
//})
//
//console.log('!!',parsed2.map(searchSolutions).reduce((a,b) => a+b, 0))
