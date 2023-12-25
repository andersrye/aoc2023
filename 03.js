require('./dirty-tricks')
const input = require('fs').readFileSync('./inputs/03.txt', 'utf-8')
const lines = input.split('\n')

function* neighbors(lineIndex, index, length) {
  for (let i = lineIndex - 1; i <= lineIndex + 1; i++) {
    for (let j = index - 1; j <= index + length; j++) {
      yield [lines[i]?.[j], i, j]
    }
  }
}

const solution1 = lines
  .flatMap((line, lineIndex) =>
    Array.from(line.matchAll(/\d+/g)).map(({0: match, index}) => [match, lineIndex, index]))
  .filter(([match, lineIndex, index]) =>
    neighbors(lineIndex, index, match.length).some(([c]) => c?.match(/[^\d.\s]/)))
  .reduce((acc, [match]) => acc + parseInt(match), 0)

console.log('solution1', solution1)

const gears = lines
  .flatMap((line, lineIndex) =>
    Array.from(line.matchAll(/\d+/g)).flatMap(({0: match, index}) =>
      neighbors(lineIndex, index, match.length).reduce((acc, [m, i, j]) =>
          m === '*' ? [...acc, [match, `${i},${j}`]] : acc, [])
    ))
  .reduce((acc, [match, gearId]) => (acc[gearId] = [...acc[gearId] ?? [], match], acc), {})

const solution2 = Object.values(gears)
  .reduce((acc, val) => val.length === 2 ? acc + parseInt(val[0]) * parseInt(val[1]) : acc, 0)

console.log('solution2', solution2)