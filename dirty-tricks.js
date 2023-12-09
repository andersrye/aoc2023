const reduce = function (fn, acc) {
  for (const val of this) {
    acc = fn(acc, val)
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


const Generator = Object.getPrototypeOf(function* () {})
const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()))

Object.assign(Generator.prototype, {map: mapGenerator, some, reduce})
Object.assign(IteratorPrototype, {map, some, reduce})
Object.assign(String.prototype, {map, some, reduce})
