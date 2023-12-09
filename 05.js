const fs = require('fs')
const input = fs.readFileSync('./inputs/05.txt', 'utf-8')

const parsed = input.split("map")
  .map(l => Array.from(l.matchAll(/\d+/g)).map(n => parseInt(n[0])))

function mapper(values) {
  const map = []
  for (let i = 0; i < values.length; i += 3) {
    map.push([values[i], values[i + 1], values[i + 2]])
  }
  return function (num) {
    const [dest, source] = map.find(([, source, range]) => num >= source && num < source + range) ?? [0, 0]
    return num + dest - source
  }
}

const [seeds, ...maps] = parsed
const mappers = maps.map(mapper)

function seedToLocation(seed) {
  return mappers.reduce((acc, fn) => fn(acc), seed)
}

const solution1 = Math.min.apply(null, seeds.map(seedToLocation))

console.log('solution1', solution1)

let min = Infinity
for (let i = 0; i < seeds.length; i += 2) { //advarsel: tar ca 30 min!
  console.log('still working', i)
  for (let j = seeds[i]; j < seeds[i] + seeds[i + 1]; j++) {
    const location = seedToLocation(j)
    if (location < min) min = location
  }
}

console.log('solution2', min)