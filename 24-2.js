const input = require('fs').readFileSync('./inputs/24.txt', 'utf-8')
const {init} = require('z3-solver')

//måtte gi opp denne og ty til å lære meg å bruke z3 (etter hint fra reddit)

const lines = input.split('\n')
  .map(l => l.split('@').map(c => c.split(',').map(n => +n)))

init().then(async ({Context}) => {
  const {Solver, Real} = Context()
  const solver = new Solver()
  const [
    varX, varY, varZ, varVx, varVy, varVz
  ] = ['x', 'y', 'z', 'vx', 'vy', 'vz'].map(Real.const)
  lines.slice(0, 3).forEach(([[x, y, z], [vx, vy, vz]], i) => {
    const t = Real.const("t" + i)
    solver.add(t.mul(vx).add(x).eq(t.mul(varVx).add(varX)))
    solver.add(t.mul(vy).add(y).eq(t.mul(varVy).add(varY)))
    solver.add(t.mul(vz).add(z).eq(t.mul(varVz).add(varZ)))
  })
  const check = await solver.check()
  if (check === 'sat') {
    const {numerator, denominator} = solver.model().eval(varX.add(varY).add(varZ)).value()
    console.log('solution2', Number(numerator / denominator))
  } else console.log('unsat')
})