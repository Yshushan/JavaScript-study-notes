# [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
## [Headers]()
通过 `Headers` 接口，你可以在 HTTP 请求头和响应头上执行很多操作。

### [`Headers.append()`]()
用法：`myHeaders.append(name, value)`

如果指定的header 字段已经存在，且这个字段不接受多个值，那么原来的值会被覆盖，如果这个字段接受多个值，新增的值会被添加到值列表后面。
### [`Headers.set()`]()
用法：`myHeaders.set(name, value)`

与 `append` 方法不同的是，如果指定的字段已存在，不管它接不接受多个值，都会被覆盖。
### [`Headers.get()`]()
用法：`myHeaders.get(name)`

返回对应字段的值，如果提供的 `name` 不是一个合法的 HTTP 头字段，将抛出`TypeError` 异常。如果 `name`合法但该字段不存在，返回 `null`
### [`Headers.has()`]()
用法：`myHeaders.has(name)`

返回布尔值，表示是否存在指定的字段，如果提供的 `name` 不是一个合法的 HTTP 头字段，将抛出`TypeError` 异常。
### [`Headers.keys()`]()
用法：`myHeaders.keys()`

返回一个迭代器，允许你去遍历这个对象里所有的键
### [`Headers.values()`]()
用法：`myHeaders.values()`

返回一个迭代器，允许你去遍历这个对象里所有的值
### [`Headers.entries()`]()
用法：`myHeaders.entries()`

返回一个迭代器，允许你去遍历这个对象里所有的键/值对
### [`Headers.delete()`]()
用法：`myHeaders.delete(name)`

### Example:
```js
const myHeaders = new Headers()

myHeaders.append('Content-Type', 'image/jpeg')
myHeaders.has('Content-Type') // => true
myHeaders.get('Content-Type') // => 'image/jpeg'

myHeaders.append('Accept-Encoding', 'deflate')
myHeaders.append('Accept-Encoding', 'gzip')
myHeaders.get('Accept-Encoding') // => 'deflate, gzip'


for(let key of myHeaders.keys()){
    console.log(key)
}
// 'Content-Type'
// 'Accept-Encoding'

for(let value of myHeaders.values()){
    console.log(value)
}
// 'image/jpeg'
// 'deflate, gzip'

for(let pair of myHeaders.entries()){
    console.log(`${pair[0]}: ${pair[1]}`)
}
// 其实Headers对象本身已经实现了迭代器接口，可以直接遍历Headers对象，所以上面等价于：
for(let pair of myHeaders){
    console.log(`${pair[0]}: ${pair[1]}`)
}
// Content-Type：image/jpeg
// Accept-Encoding: deflate, gzip

myHeaders.delete('Content-Type') 
myHeaders.has('Content-Type') // => false
myHeaders.get('Content-Type') // => null
```
## [Body]()
`Body` 接口允许你操作响应和请求的主体部分

`Request` 和 `Response` 对象实现了 `Body` 接口

### 属性
+ [`Body.bodyUsed`]()
### 方法
+ [`Body.arrayBuffer()`]()
+ [`Body.blob()`]()
+ [`Body.formData()`]()
+ [`Body.json()`]()
+ [`Body.text()`]()
 
## Requset
### [Request()]()
用法: `const myRequest = new Request(input[, init])`

***input***： 代表你想要请求的资源，它可以是下面这些值：
+ 一个直接包含你想要 fetch 的资源的 URL 的 [`USVString`]()
+ 另一个 `Request` 对象。

***init***：可选的选项对象，包含你想要应用到请求中的自定义设置，可以包含下面这些选项：
+ `method`: 请求的方法，例如：`GET`, `POST`。
+ `headers`: 请求头，可以是一个预先创建的 `Headers` 对象，或者是一个包含选项的对象字面量。
+ `body`: 任何你想要添加到请求中的 body，可以是一个 `Blob`, `BufferSource`, [`FormData`](), [`URLSearchParams`](), `USVString` 等对象。注意 `GET` 和 `HEAD` 请求不能包含这个选项。
+ `mode`: 请求的模式，可以是 `cors`, `no-cors`, `same-origin`, `navigate`。
+ `credentials`: 请求证书，可以是 `omit`, `same-origin`, `include`。
+ `cache`: [cache 模式]()
+ `redirect`: 重定向模式，可以是 `follow`, `error`, `manual`
+ `referrer`: 
+ `integrity`:
## Response