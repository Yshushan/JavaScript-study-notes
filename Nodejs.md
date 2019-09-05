# Node.js

## [Events](https://nodejs.org/dist/latest-v10.x/docs/api/events.html)

### emitter.on(eventName, listener) / emitter.addListener(eventName, listener)

注册 `eventName` 事件，并在它的事件监听器数组的末尾添加 `listener` 事件监听器，基本用法：

```js
const events = require('events')
class MyEmitter extends events {}
const myemitter = new MyEmitter()

myemitter.on('my-event', function(a, b) {
  console.log(a, b)
})
myemitter.emit('my-event', 'hello', 'node.js')
// hello, node.js
```

在同一个事件上可以注册多个处理函数：

```js
myemitter.on('my-event', listener1)
myemitter.on('my-event', listener2)
```

> 注意，注册事件时不会去检查当前监听器数组中是否已经存在相同的监听器（`listener`），如果你多次为同一事件添加相同的监听器，那么结果就是当该事件被触发时，这个监听器会被调用多次。

### emitter.once(eventName, listener)

要使事件的某个监听器只被调用一次，使用 `once` 方法，对应的监听器第一次被调用之后将被移除：

```js
myemitter.once('my-event', () => {
  console.log('invoked only once')
})
myemitter.listenerCount('my-event') // 1
myemitter.emit('my-event') // invoked only once

myemitter.listenerCount('my-event') // 0 被移除
myemitter.emit('my-event') // nothing
```

`once` 同样也将事件监听器添加到监听器数组的末尾

### emitter.prependListener(eventName, listener)

同 `on` 方法一样，该方法也用于注册事件监听器，不同的是，通过 `on` 注册的事件监听器是被追加到监听器数组的末尾，而 `prependListener` 方法将事件监听器添加到监听器数组的开头：

```js
myemitter.on('foo', () => console.log('a'))
myemitter.prependListener('foo', () => console.log('b'))
myemitter.emit('foo')
// b
// a
```

### emitter.prependOnceListener(eventName, listener)

同 `once` 方法，但是监听器被添加到监听器数组的开头。

### emitter.emit(eventName[, ...args])

按照监听器注册的顺序，同步的调用为指定的事件名注册的所有监听器函数。同时可以给事件监听器传递任意个参数，且如果监听器函数是普通函数，函数内部的 `this` 指向原事件对象：

```js
myemitter.on('foo', function(a, b) {
  console.log(a, b, this === myemitter)
})

myemitter.emit('foo', 'a', 'b')
// a, b, ture
```

如果使用 ES6 的箭头函数来定义监听器，则 `this` 不再指向 `myemitter` 对象。

如果有需要，也可以在注册事件监听器时通过 `setImmediate` 将监听器函数转换成异步模式：

```js
myemitter.on('my-event', () => {
  setImmediate(() => {
    console.log('Asynchronous mode')
  })
})
```

`emit` 方法返回一个 `Boolean` 值，如果对应的事件名有监听器，返回 `true`，否则返回 `false`.

### emitter.off(eventName, listener) / emitter.removeListener(eventName, listener)

从对应事件名的监听器数组中移除指定的监听器，`off/removeListener` 方法调用一次，最多只会移除一个监听器实例，如果某个监听器函数被注册了多次，那么需要调用该函数多次来移除所有的实例：

```js
const callback = () => console.log('hello')
myemitter.on('foo', callback)
myemitter.on('foo', callback) // callback 再次被添加到监听器数组中
myemitter.emit('foo')
// hello
// hello

myemitter.off('foo', callback) // 移除一个 callback 实例
myemitter.emit('foo')
// hello
myemitter.removeListener('foo', callback) // 移除第二个 callback 实例
myemitter.emit('foo')
// ...
```

注意，一旦某个事件被触发，它对应的所有监听器函数会依次被调用，在这个调用周期内，所有监听器函数不会受到 `off/removeListener/removeAllListeners` 这些方法的影响。这意味着在事件触发后到它最后一个监听器完成调用，这段期间调用任何监听器移除函数都不会影响任何监听器的执行，但是在这个调用周期后，该监听器将被移除：

```js
const callbackA = () => {
  console.log('A')
  myemitter.removeListener('foo', callbackB)
}
const callbackB = () => console.log('B')

myemitter.on('foo', callbackA).on('foo', callbackB)

// 在 callbackA 中移除监听器 callbackB, 但是在当前调用周期内 callbackB 仍然会被调用
myemitter.emit('foo')
// A
// B

// 下一个调用周期，callbackB 已被移除了
myemitter.emit('foo')
// A
```

### emitter.removeAllListeners([eventName])

移除所有监听器，或者移除指定的事件名的所有监听器

### emitter.listeners(eventName)

返回指定事件名对应监听器数组的拷贝

```js
myemitter.on('foo', listener1).on('foo', listener2)
const fooListeners = myemitter.listeners('foo') // [ [Function], [Function] ]
```

### emitter.rawListeners(eventName)

返回指定的事件上注册的所有监听器的数组的拷贝，详细请看[这里](https://nodejs.org/dist/latest-v10.x/docs/api/events.html#events_emitter_rawlisteners_eventname)。

### emitter.eventNames()

返回该事件对象上注册的所有事件名的数组，数组的元素可以是 `String` 或者 `Symbol`：

```js
const yss = Symbol('yss')
myemitter
  .on('foo', listener1)
  .once('bar', listener2)
  .prependListener('baz', listener3)
  .prependOnceListener(yss, listener4)
const eventNames = myemitter.eventNames() // [ 'foo', 'bar', 'baz', Symbol(yss) ]
```

### Event: 'error'

当事件对象发生错误时，`'error'` 事件将被触发，`'error'` 是 `Node.js` 内置事件，如果你没有给 `'error'` 事件注册任何监听器函数，当错误发生时，
会抛出异常，同时 `Node.js` 进程被终止。为了防止程序崩溃，最好方法是给 `'error'` 注册错误监听器函数，来处理错误情况：

```js
myemitter.on('error', err => {
  console.log('whoops! there are an error')
})
```

### Event: 'newListener'

当事件对象注册新的监听器时，内置的 `'newListener'` 事件会被触发，同时，对应的**事件名**和新添加的**处理函数的引用**会作为参数传给 `'newListener'` 的监听器函数，
利用这个机制，可以做很多有用的事：

```js
// 在 myemitter 注册第一个事件监听器之前，添加一个监听器
myemitter.once('newListener', (name, listener) => {
  if (name === 'my-event') {
    // insert a new listener in front
    myemitter.on('my-event', () => {
      console.log('do something first')
    })
  }
})

myemitter.on('my-event', () => {
  console.log('hello, node.js')
})

myemitter.emit('my-event')

// do something first
// hello, node.js
```

如上面所看到的，`newListener` 会在添加新事件监听器之前触发。

### Event: 'removeListener'

事件对象还有一个内置的事件 `'removeListener'`, 它将在某个事件监听器被移除之后触发，用法类似于 `'newListener'`。

> **注意：`on`, `off`, `once`, `addListener`, `removeListener`, `prependListener`, `prependOnceListener`, `removeAllListeners` 这些方法都返回原事件对象的引用，所以你可以进行链式调用。**

## [File System](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html)

### fs.appendFile(path, data[, options], callback)

异步地向指定的文件末尾添加数据，如果指定的文件不存在，将创建该文件。

数据 `data` 可以是字符串或者一个 `Buffer`。

`options` 可选，如果是个字符串，它指定文件的编码形式，默认值是 `utf8`。

`callback` 回调函数在操作完成之后执行，接受可能的 `Error` 对象作为参数。

```js
const fs = require('fs')
fs.appendFile('message.txt', 'data to append', err => {
  if (err) throw err // 如果操作成功，err 将是 null or undefined
  console.log('The "data to append" was appended to file!')
})
```

### fs.appendFileSync(path, data[, options])

`appendFile` 的同步版本，除了不支持 `callback`，其它参数与 `appendFile` 完全相同

```js
try {
  fs.appendFileSync('message.txt', 'data to append', 'utf8')
  console.log('The "data to append" was appended to file!')
} catch {
  /* Handle the error */
}
```

### fs.close(fd, callback)

### fs.closeSync(fd)

### [fs.constants](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_constants)

### [fs.copyFile(src, dest[, flags], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_copyfile_src_dest_flags_callback)

异步的将 `src` 复制到 `dest`。

默认情况下，如果 `dest` 已经存在，它的内容会被覆盖掉。

`flags` 是一个可选的整数，用于指定复制操作的行为

- `fs.constants.COPYFILE_EXCL`: 如果 `dest` 已存在，复制操作会失败
- `fs.constants.COPYFILE_FICLONE`: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then a fallback copy mechanism is used.
- `fs.constants.COPYFILE_FICLONE_FORCE`: The copy operation will attempt to create a copy-on-write reflink. If the platform does not support copy-on-write, then the operation will fail.

`callback` 在操作结束后调用，接受可能的 exception 作为参数。

```js
const fs = require('fs')
fs.copyFile('source.js', 'destination.js', err => {
  if (err) throw err
  console.log('source.js was copies to destination.js')
})

const { COPYFILE_EXCL } = fs.constants

// By using COPYFILE_EXCL, the operation will fail if destination.js exists.
fs.copyFile('source.js', 'destination.js', COPYFILE_EXCL, callback)
```

### [fs.copyFileSync(src, dest[, flags])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_copyfilesync_src_dest_flags)

`fs.copyFile` 的同步版本

### [fs.createReadStream(path[, options])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_createreadstream_path_options)

### [fs.createWriteStream(path[, options])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_createwritestream_path_options)

### [fs.open(path, flags[, mode], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_open_path_flags_mode_callback)

### [fs.openSync(path, flags[, mode])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_opensync_path_flags_mode)

### [fs.read(fd, buffer, offset, length, position, callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback)

### [fs.readSync(fd, buffer, offset, length, position)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readsync_fd_buffer_offset_length_position)

### [fs.readdir(path[, options], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readdir_path_options_callback)

### [fs.readdirSync(path[, options])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readdirsync_path_options)

### [fs.readFile(path[, options], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readfile_path_options_callback)

### [fs.readFileSync(path[, options])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_readfilesync_path_options)

### [fs.rename(oldPath, newPath, callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_rename_oldpath_newpath_callback)

### [fs.renameSync(oldPath, newPath)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_renamesync_oldpath_newpath)

### [fs.rmdir(path, callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_rmdir_path_callback)

### [fs.rmdirSync(path)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_rmdirsync_path)

### [fs.unlink(path, callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_unlink_path_callback)

### [fs.unlinkSync(path)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_unlinksync_path)

### [fs.watch(filename[, options][, listener])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_watch_filename_options_listener)

Watch for changes on filename, where filename is either a file or a directory.

The second argument is optional. If options is provided as a string, it specifies the encoding. Otherwise options should be passed as an object.

On most platforms, 'rename' is emitted whenever a filename appears or disappears in the directory.

The listener callback is attached to the 'change' event fired by fs.FSWatcher, but it is not the same thing as the 'change' value of eventType.

### [fs.writeFile(file, data[, options], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_writefile_file_data_options_callback)

Asynchronously writes data to a file, replacing the file if it already exists. data can be a string or a buffer.

It is unsafe to use fs.writeFile() multiple times on the same file without waiting for the callback. For this scenario, `fs.createWriteStream()` is recommended.

If a file descriptor is specified as the file, it will not be closed automatically.

### [fs.writeFileSync(file, data[, options])](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_writefilesync_file_data_options)

### [fs.write(fd, buffer[, offset[, length[, position]]], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback)

### [fs.write(fd, string[, position[, encoding]], callback)](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_write_fd_string_position_encoding_callback)

## [Path](https://nodejs.org/dist/latest-v10.x/docs/api/path.html)

```js
const path = require('path')
```

### path.basename(path[, ext])

### path.dirname(path)

### path.format(pathObject)

### path.resolve([...paths])

### path.isAbsolute(path)

### path.normalize(path)

### path.parse(path)

### path.relative(from, to)

### path.join([...paths])

### path.extname(path)

### path.sep

### path.delimiter

### path.posix

### path.win32

## [Query String](https://nodejs.org/dist/latest-v10.x/docs/api/querystring.html)

```js
const qs = require('querystring')
```

### qs.parse(str[, sep[, eq[, options]]])

### qs.stringify(obj[, sep[, eq[, options]]])

## [URL](https://nodejs.org/dist/latest-v10.x/docs/api/url.html)

```js
const url = require('url')
```

## [HTTP](https://nodejs.org/dist/latest-v10.x/docs/api/http.html)

## [Crypto](https://nodejs.org/dist/latest-v10.x/docs/api/crypto.html)

### Methods

#### [crypto.createCipheriv(algorithm, key, iv[,options])](https://nodejs.org/dist/latest-v10.x/docs/api/crypto.html#crypto_crypto_createcipheriv_algorithm_key_iv_options)

使用指定的 `algorithm`, `key`, `iv` 创建并返回一个 `Cipher` 对象。

`algorithm` 是加密算法， `key` 用于加密算法，`iv` 是一个 initialization vector, 所有参数都必须是 `utf8` 编码的字符串或 `Buffer` 或 `TypedArray` 或 `DataView` 类型，如果不需要 innitialization vector, `iv` 可以是 `null`,

innitialization vector 应该是不可预测且唯一，详细请看文档。

#### crypto.scrypt(password, salt, keylen[,options], callback)

基于密码的密钥生成函数（password-based key derivation function), 同步版本使用 `crypto.scryptSync(password, salt, keylen[,options])`

`salt` 应该尽可能唯一，建议是至少 16 字节长度的随机值

`callback` 接受两个参数 `err` 和 `derivedKeyBuf`, `derivedKeyBuf` 是一个 `Buffer`

```js
const crypto = require('crypto')

crypto.scrypt('secret', 'salt', 64, (err, derivedKeyBuf) => {
  if (err) throw err
  console.log(derivedKeyBuf.toString('hex'))
})
```

#### crypto.randomBytes(size[, callback])

生成加密的强伪随机数，`size` 代表生成的字节长度， 如果提供 `callback`, 异步生成，否则同步生成。`callback` 接受两个参数 `err` 和 `buf`, `buf` 是一个包含生成字节的 `Buffer`

```js
// asynchronous
crypto.randomBytes(64, (err, buf) => {
  if (err) throw err
  console.log(buf.toString('hex'))
})

// synchronous
const buf = crypto.randomBytes(64)
console.log(buf.toString('hex'))
```

#### crypto.createHash(algorithm[, options])

使用给定的算法生成并返回一个 `Hash` 对象，该 hash 对象用于生成 hash 摘要

```js
const algorithm = 'sha256' // 'sha256', 'sha512' etc
const hash = crypto.createHash(algorithm)
```

#### crypto.createHmac(algorithm, key[, options])

使用给定的算法和 `key` 生成并返回一个 `Hmac` 对象, 该 hmac 对象用于生成 加密的 HMAC hash 摘要

```js
const algorithm = 'sha256' // 'sha256', 'sha512' etc
const secret = 'a secret'
const hmac = crypto.createHmac(algorithm, secret)
```

#### crypto.createSign(algorithm[, options])

使用给定的算法生成并返回一个 `Sign` 对象

#### crypto.createVerify(algorithm[, options])

使用给定的算法生成并返回一个 `Verify` 对象

#### crypto.getHashes()

返回一个数组，包含当前支持的所有 hash 算法的名字

### Class: Cipher

`Cipher` 类用于给数据加密

#### cipher.update(data[,inputEncoding][,outputencoding])

`data` 是要加密的数据，`inputEncoding` 的值为 `'utf8'`, `'ascii'`, `'latin1'` 之一，如果提供了 `inputEncoding` 参数，`data` 必须为指定编码类型的字符串，否者 `data` 必须是 `'Buffer'`, `'TypedArray'`, `'DataView'` 类型之一。`outputEncoding` 指定加密数据的输出格式，可以是 `'latin1'`, `'base64'`, `'hex'` 之一，如果提供了 `outputEncoding` 参数， 方法返回一个字符串，否则返回一个 `Buffer`。

在 `cipher.final` 方法调用之前，`cipher.update` 可以被调用多次，在`cipher.final` 方法调用之后不能再调用 `cipher.update` 方法，否则会报错。

#### cipher.final([outputEncoding])

生成剩余的加密内容（remaining enciphered contents）

`outputEncoding` 指定输出数据的编码类型，可以是 `'latin1'`, `'base64'`, `'hex'` 之一，如果提供了 `outputEncoding` 参数， 方法返回一个字符串，否则返回一个 `Buffer`。

一旦 `cipher.final` 方法被调用之后，`Cipher` 对象不能再用来加密数据，如果试图再次调用 `cipher.final` 方法，将会抛出错误

```js
const crypto = require('crypto')

const algorithm = 'aes-192-cbc'
const password = 'marefaker'
const salt = crypto.randomBytes(16)
const key = crypto.scryptSync(password, salt, 24)
const iv = crypto.randomBytes(16)

const cipher = crypto.createCipheriv(algorithm, key, iv)

const data = 'my name is nicholas yang'
let encrypted = cipher.update(data, 'utf8', 'hex')
encrypted += cipher.final('hex')

console.log(encrypted)
```

### Class: Decipher

`Decipher` 类用于给数据解密（与 `Cipher` 类对应）

#### decipher.update(data[,inputEncoding][,outputencoding])

用法与 `cipher.update` 相似

#### decipher.final([outputEncoding])

用法与 `cipher.final` 相似

例子：

```js
const crypto = require('crypto')

const algorithm = 'aes-192-cbc'
const password = 'marefaker'

// 生成16字节随机 salt
const salt = crypto.randomBytes(16)
// 生成密钥
const key = crypto.scryptSync(password, salt, 24)
// 生成16字节随机 iv
const iv = crypto.randomBytes(16)
// 生成 cipher 对象
const cipher = crypto.createCipheriv(algorithm, key, iv)

// 加密
let data = 'my name is nicholas yang'
let encrypted = cipher.update(data, 'utf8', 'hex')
encrypted += cipher.final('hex')
console.log(encrypted) // 密文

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv)
let decrypted = decipher.update(encrypted, 'hex', 'utf8')
decrypted += decipher.final('utf8')
console.log(decrypted) // 明文
```

### Class: Hash

生成数据的 hash 摘要

#### hash.update(data[, inputEncoding])

更新指定 `data` 的 hash 值, `inputEncoding` 指定 `data` 的编码方式，如果 `data` 是字符串，`inputEncoding` 默认是 `'utf8'`

#### hash.digest([encoding])

计算传递给 `hash.update`方法进行 hash 运算的数据的摘要（digest）, 如果提供 `encoding` 参数，返回一个字符串，否则返回 `Buffer`

例子：

```js
const crypto = require('crypto')
const hash = crypto.createHash('sha256')

const data = 'my name is nicholas yang'
hash.update(data)
const digest = hash.digest('hex')
console.log(digest)
```

### Class: Hmac

生成加密 HMAC 摘要

#### hmac.update(data[, inputEncoding])

#### hmac.digest([encoding])

例子：

```js
const crypto = require('crypto')
const hmac = crypto.createHmac('sha256', 'a secret')

const data = 'my name is nicholas yang'
hmac.update(data)
const digest = hmac.digest('hex')
console.log(digest)
```

### Class: Sign

用于生成签名

#### sign.update(data[, inputEncoding])

#### sign.sign(privateKey[, outputEncoding])

例子：

```js
const crypto = require('crypto')
const sign = crypto.createSign('sha256')

const data = 'my name is nicholas yang'
sign.update(data)

const privateKey = getPrivateKeySomehow()
const signature = sign.sign(privateKey, 'hex')
console.log(signature)
```

### Class: Verify

用于验证签名

#### verify.update(data[, inputEncoding])

#### verify.verify(object, signature[, signatureEncoding])

例子：

```js
const crypto = require('crypto')
const data = 'my name is nicholas yang'

// 签名
const sign = crypto.createSign('sha256')
sign.update(data)
const privateKey = getPrivateKeySomehow()
const signature = sign.sign(privateKey, 'hex')
console.log(signature)

// 验证
const verify = crypto.createVerify('sha256')
verify.update(data)
const publicKey = getPublicKeySomehow()
const res = verify.verify(publicKey, signature, 'hex')
console.log(res) // true or false
```

## [Assert](https://nodejs.org/dist/latest-v10.x/docs/api/assert.html)

该模块用于做断言测试

```js
const assert = require('assert').strict
```

### assert.strictEqual(actual, expected[, message])

### assert.notStrictEqual(actual, expected[, message])

### assert.deepStrictEqual(actual, expected[, message])

### assert.notDeepStrictEqual(actual, expected[, message])

检查 `expected` 是否和 `actual` 严格相等。如果不严格相等则抛出错误，`message` 参数可选，可以是字符串或 `Error` 实例，代表抛出的错误信息。

### assert.ifError(value)

如果 `value` 的值不是 `undefined` 或 `null`， 则抛出错误。常用这个方法来测试 callback 里的错误参数：

```js
const assert = require('assert').strict
User.findOne({ name: 'xxx' }, (err, doc) => {
  assert.ifError(err)
  console.log(doc)
})
```

### assert.ok(value[, message])

测试 `value` 是否为真值(truthy)，如果不是真值，抛出错误。

## Command Line Arguments (命令行参数)

在 node 脚本文件中可以通过 `process.argv` 来获取命令行参数, `process.argv` 是一个数组：

```js
// yss.js
process.argv.forEach((arg, index) => {
  console.log(`${index}: ${arg}`)
})
```

执行该脚本：`node yss.js a 1`， 结果为：

```
0: path/to/node.exe
1: path/to/yss.js
2: a
3: 1
```

即从 `process.argv` 的第 3 个元素开始才是传入的参数，前两个依次是 node 程序的位置和脚本文件的位置。
