# [Lodash](https://lodash.com/docs/4.17.10)
### [_.after(n, func)](https://lodash.com/docs/4.17.10#after)
返回一个新函数，当这个函数被调用次数大于等于 `n` 次时，执行 `func` 函数。而且新函数接受与 `func` 函数相同的参数，并在调用时将其传递给 `func`:
```js
let newFunc = _.after(3, (p1, p2) => console.log(p1, p2))

newFunc('hello', 'world') // func 不会执行
newFunc('hello', 'world') // func 不会执行
newFunc('hello', 'world') // => 'hello world'
newFunc('hello', 'world') // => 'hello world'
```
### [_.before(n, func)](https://lodash.com/docs/4.17.10#before)
返回一个新函数，当这个函数被调用次数小于 `n` 次时，执行 `func` 函数。而从新函数的第 `n` 次调用开始，不再执行 `func` 函数，而是始终返回 `func` 函数最后一次被调用的结果。新函数接受与 `func` 函数相同的参数，并在调用时将其传递给 `func`:
```js
let newFunc = _.before(3, p1 => p1)

console.log(newFunc(1)) // => 1
console.log(newFunc(2)) // => 2
console.log(newFunc(3)) // => 2  从这里开始 func 不再被调用
console.log(newFunc(4)) // => 2
```
### [_.debounce(func, wait=0, options={})](https://lodash.com/docs/4.17.10#debounce)
返回一个去抖函数，该函数延迟调用 `func` 函数，直到上一次调用这个去抖函数 `wait` 毫秒之后。该去抖函数带有一个取消延迟调用 `func` 的 `cancle` 方法和一个立即调用 `func` 的 `flush` 方法。`options` 参数用于设置是否在 `wait` 时间的前沿 (`options.leading`) 或者后延 (`options.trailing`) 调用 `func`，以及最大延迟时间(`options.maxWait`)。去抖函数接受与 `func` 函数相同的参数，并在调用时将其传递给 `func`，在延迟时间内对去抖函数的调用不会导致 `func` 的调用，且始终返回上一次 `func` 执行的结果:
```js
let a=1
// 上一次 debouncedFunc 被调用300ms后，执行 func
// 默认在延迟时间的后延调用 func，即第三个参数默认是 {leading: false, trailing: true}
let debouncedFunc1 = _.debounce(p1 => p1, 300)
// 每隔100ms调用一次 debouncedFunc1
// 由于连续两次调用的时间间隔小于 debouncedFunc1 的延迟时间300ms，且 debouncedFunc1 设置为后延调用 func，所以 func 一次都不会被执行。所以下面的代码不会打印任何结果
setInterval(() => {
  console.log(debouncedFunc1(a++))
}, 100)

// 设置最大延迟时间 maxWait=1000ms, 固定每隔1000ms，func 会被执行一次
let debouncedFunc2 = _.debounce(p1 => p1, 300, {maxWait: 1000})
// 每隔100ms调用一次 debouncedFunc2
// 虽然连续两次调用的时间间隔小于 debouncedFunc2 的延迟时间300ms，但是由于设置了最大延迟调用时间间隔，所以在每隔1000ms后，func 会被调用一次
setInterval(() => {
  console.log(debouncedFunc1(a++))
}, 200)
// => 6 1200ms
// => 6 1400ms
// => 6 1600ms
// => 6 1800ms
// => 6 2000ms
// => 11 2200ms
// => 11 2400ms
// => 11 2600ms
// => 11 2800ms
// => 11 3000ms
// => 16 3200ms
// => 16 3400ms
// ...

// 如果设置在延迟时间的前沿调用 func，func 会在第一次调用 debouncedFunc3 时首先被执行一次
let debouncedFunc3 = _.debounce(p1 => p1, 300, {leading: true})
// func 只会在 debouncedFunc3 第一次被调用时执行一次，后面不会再被执行
setInterval(() => {
  console.log(debouncedFunc3(a++))
}, 200)
// => 1 200ms
// => 1 400ms
// => 1 600ms
// ...
```
> **Note**: If `leading` and `trailing` options are `true`, `func` is invoked on the trailing edge of the timeout only if the debounced function is invoked more than once during the wait timeout.

 If `wait` is 0 and `leading` is `false`, `func` invocation is deferred until to the next tick, similar to `setTimeout` with a timeout of 0.
### [_.defer(func[, args])](https://lodash.com/docs/4.17.10#defer)
延迟调用 `func` 直到当前调用栈为空，`args` 为提供给 `func` 的额外参数。
### [_.delay(func, wait[, args])](https://lodash.com/docs/4.17.10#delay)
等待 `wait` 毫秒之后调用 `func`，`args` 为提供给 `func` 的额外参数
### [_.once(func)](https://lodash.com/docs/4.17.10#once)
返回一个新函数，它只调用 `func` 一次，对这个新函数的重复调用都返回第一次调用`func`时的返回值。
### [_.throttle(func, wait=0, options={})](https://lodash.com/docs/4.17.10#throttle)
Creates a throttled function that only invokes func at most once per every wait milliseconds. The throttled function comes with a cancel method to cancel delayed func invocations and a flush method to immediately invoke them. Provide options to indicate whether func should be invoked on the leading and/or trailing edge of the wait timeout. The func is invoked with the last arguments provided to the throttled function. Subsequent calls to the throttled function return the result of the last func invocation.

> **Note**: If leading and trailing options are true, func is invoked on the trailing edge of the timeout only if the throttled function is invoked more than once during the wait timeout.

If wait is 0 and leading is false, func invocation is deferred until to the next tick, similar to setTimeout with a timeout of 0.
### [_.clone(value)](https://lodash.com/docs/4.17.10#clone)
返回 value 的 shallow copy，value 可以是 arrays, array buffers, booleans, date objects, maps, numbers, Object objects, regexes, sets, strings, symbols, and typed arrays。The own enumerable properties of arguments objects are cloned as plain objects. An empty object is returned for uncloneable values such as error objects, functions, DOM nodes, and WeakMaps.
### [_.cloneDeep(value)](https://lodash.com/docs/4.17.10#cloneDeep)
This method is like _.clone except that it recursively clones value.
### [_.cloneWith(value[, customizer])](https://lodash.com/docs/4.17.10#cloneWith)
This method is like _.clone except that it accepts customizer which is invoked to produce the cloned value. If customizer returns undefined, cloning is handled by the method instead. The customizer is invoked with up to four arguments; (value [, index|key, object, stack]).
### [_.cloneDeepWith(value[, customizer])](https://lodash.com/docs/4.17.10#cloneDeepWith)
This method is like _.cloneWith except that it recursively clones value.
### [_.times](https://lodash.com/docs/4.17.10#times)

