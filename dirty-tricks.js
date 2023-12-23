const reduce = function (fn, acc) {
  let i = 0
  for (const val of this) {
    acc = fn(acc, val, i++)
  }
  return acc
}

const map = function (fn) {
  let res = []
  for (const val of this) {
    res.push(fn(val))
  }
  return res
}

const some = function (pred) {
  for (const val of this) {
    if(pred(val))
      return true
  }
  return false
}

const mapGenerator = function* (fn) {
  for (const val of this) {
    yield fn(val)
  }
}

const filterGenerator = function*(pred) {
  for (const val of this) {
    if(pred(val)) {
      yield val
    }
  }
}

const takeGenerator = function* (n) {
  let i = 0
  for (const val of this) {
    if (i++>n) return
    yield val
  }
}


const Generator = Object.getPrototypeOf(function* () {})
const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))

Object.assign(Generator.prototype, {map: mapGenerator, filter: filterGenerator,take: takeGenerator, some, reduce})
Object.assign(IteratorPrototype, {map, some, reduce})
Object.assign(String.prototype, {map, some, reduce, every: Array.prototype.every})
