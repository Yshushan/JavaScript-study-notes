# Node.js

## Events
基本用法：
```js
const events = require('events')
class MyEmitter extends events {}
const myemitter = new MyEmitter()

myemitter.on('my-event', function(a,b){
    console.log(a,b)
})
myemitter.emit('my-event','hello','node.js')
```
在同一个事件上可以注册多个处理函数：
```js
myemitter.on('my-event', handler1)
myemitter.on('my-event', handler2)
```
默认情况下，这些处理函数会按照它们注册的顺序被同步调用，但是也可以通过 `setImmediate` 将这些处理函数转换成异步模式：
```js
myemitter.on('my-event', () => {
    setImmediate(() => {
        console.log('Asynchronous mode')
    })
})
```
要使事件只被触发一次，即处理函数只被调用一次，使用 `once` 方法：
```js
myemitter.once('my-event', () => {
    console.log('invoked only once')
})
```
当事件对象发生错误时，`'error'` 事件将被触发，`'error'` 是 `Node.js` 内置事件，如果你没有给该事件注册任何处理函数，当错误发生时，
会抛出异常，同时 `Node.js` 进程被终止。为了防止程序崩溃，最好方法是给 `'error'` 注册错误处理函数：
```js
const myemitter1 = new MyEmitter()

myemitter1.on('error',(err) => {
    console.log('whoops! there are an error')
})
```
当事件对象注册新的处理函数的时，内置的 `'newListener'` 事件会被触发，同时，对应的**事件名**和新添加的**处理函数的引用**会作为参数传给 `'newListener'` 的处理函数，
利用这个机制，可以做很多有用的事：
```js
const myemitter2 = new MyEmitter()

myemitter2.once('newListener', (name, handler) => {
    if(name==='my-event') {
        // insert a new listener in front
        myemitter2.on('my-event', () => {
            console.log('do something first')
        })
    }
})

myemitter2.on('my-event', () => {
    console.log('hello, node.js')
})

myemitter2.emit('my-event')

// do something first
// hello, node.js
```
如上面所看到的，`newListener` 会在添加新处理函数之前触发。

事件对象还有一个内置的事件 `'removeListener'`, 它将在某个事件处理函数被移除之后触发，用法类似于 `'newListener'`

更多事件对象方法请参考[这里](https://nodejs.org/dist/latest-v8.x/docs/api/events.html)