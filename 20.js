require('./dirty-tricks')
const {printSolution, lcm} = require("./util");
const input = require('fs').readFileSync('./inputs/20.txt', 'utf-8')

class Broadcaster {
  pulse(input) {
    return input
  }
}

class FlipFlop {
  state = false

  pulse(input) {
    if (!input) {
      if (this.state) {
        this.state = false
        return false
      } else {
        this.state = true
        return true
      }
    }
  }
}

class Conjunction {
  state = {}

  pulse(input, source) {
    this.state[source] = input
    //console.log('state', this.state, Object.values(this.state), Object.values(this.state).every(p => p))
    return !Object.values(this.state).every(p => p);
  }
}

function parseModules() {
  const modules = input.split('\n').reduce((acc, line) => {
    const [moduleString, outputString] = line.split(/\s*->\s*/)
    const outputs = outputString.split(/\s*,\s*/)
    if (moduleString.startsWith('&')) {
       acc[moduleString.slice(1)] =  [new Conjunction(), outputs]
    } else if (moduleString.startsWith('%')) {
      acc[moduleString.slice(1)] = [new FlipFlop(), outputs]
    } else if (moduleString === 'broadcaster') {
      acc[moduleString] = [new Broadcaster(), outputs]
    }
    return acc
  }, {})
  //init conjunction modules
  Object.entries(modules).forEach(([name, [_, outputs]]) => {
    outputs.forEach(o => {
      if (modules[o]?.[0] instanceof Conjunction) {
        modules[o][0].pulse(false, name)
      }
    })
  })
  return modules
}

function pushButton(modules) {
  const queue = [['button', 'broadcaster', false]]
  const pulseCounts = {}
  while (queue.length) {
    const [source, dest, pulse] = queue.pop()
    //console.log(`${source} ${pulse?'-high->':'-low->'} ${dest}`)
    pulseCounts[source] = (pulseCounts[source] ?? {})
    pulseCounts[source][pulse] = (pulseCounts[source][pulse] ?? 0) + 1
    if (!modules?.[dest]) continue
    const [module, outputs] = modules[dest]
    const newPulse = module.pulse(pulse, source)
    if (newPulse === undefined) continue
    const newPulses = outputs.map(o => [dest, o, newPulse])
    queue.unshift(...newPulses)
  }
  return pulseCounts
}

printSolution('solution1', () => {
  const modules1 = parseModules()
  let totalCounts = {false: 0, true: 0}
  for (let i = 0; i < 1000; i++) {
    const r = pushButton(modules1)
    Object.values(r).reduce((acc, v) => {
      for (const k in v) {
        acc[k] += v[k]
      }
      return acc
    }, totalCounts)
  }
  return totalCounts[true] * totalCounts[false]
})

printSolution('solution2', () => {
  const modules2 = parseModules()
  let counts = {}
  for (let i = 1; i < 4000; i++) {
    const r = pushButton(modules2);
    ['ts', 'xd', 'pf', 'vr'].forEach(k => {
      if (r[k][false]) counts[k] = counts[k] || i
    })
  }
  return Object.values(counts).reduce(lcm)
})