const Generator = Object.getPrototypeOf(function* () {})

Generator.prototype.map = function* (fn) {
  for (const val of this) {
    yield fn(val)
  }
}

Generator.prototype.some = function (pred) {
  for (const val of this) {
    if(pred(val))
      return true
  }
  return false
}

Generator.prototype.reduce = function (fn, acc) {
  for (const val of this) {
    acc = fn(acc, val)
  }
  return acc
}