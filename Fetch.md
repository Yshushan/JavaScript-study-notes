# [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
## [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
通过 `Headers` 接口，你可以在 HTTP 请求头和响应头上执行很多操作。

### [`Headers.append()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/append)
用法：`myHeaders.append(name, value)`

如果指定的header 字段已经存在，且这个字段不接受多个值，那么原来的值会被覆盖，如果这个字段接受多个值，新增的值会被添加到值列表后面。
### [`Headers.set()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/set)
用法：`myHeaders.set(name, value)`

与 `append` 方法不同的是，如果指定的字段已存在，不管它接不接受多个值，都会被覆盖。
### [`Headers.get()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/get)
用法：`myHeaders.get(name)`

返回对应字段的值，如果提供的 `name` 不是一个合法的 HTTP 头字段，将抛出`TypeError` 异常。如果 `name`合法但该字段不存在，返回 `null`
### [`Headers.has()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/has)
用法：`myHeaders.has(name)`

返回布尔值，表示是否存在指定的字段，如果提供的 `name` 不是一个合法的 HTTP 头字段，将抛出`TypeError` 异常。
### [`Headers.keys()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/keys)
用法：`myHeaders.keys()`

返回一个迭代器，允许你去遍历这个对象里所有的键
### [`Headers.values()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/values)
用法：`myHeaders.values()`

返回一个迭代器，允许你去遍历这个对象里所有的值
### [`Headers.entries(https://developer.mozilla.org/en-US/docs/Web/API/Headers/entries)`]()
用法：`myHeaders.entries()`

返回一个迭代器，允许你去遍历这个对象里所有的键/值对
### [`Headers.delete()`](https://developer.mozilla.org/en-US/docs/Web/API/Headers/delete)
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

for(let [key, value] of myHeaders.entries()){
    console.log(`${key}: ${value}`)
}
// 其实 Headers 对象本身已经实现了迭代器接口，可以直接遍历 Headers 对象，所以上面等价于：
for(let [key, value] of myHeaders){
    console.log(`${key}: ${value}`)
}
// Content-Type：image/jpeg
// Accept-Encoding: deflate, gzip

myHeaders.delete('Content-Type') 
myHeaders.has('Content-Type') // => false
myHeaders.get('Content-Type') // => null
```
## [Body](https://developer.mozilla.org/en-US/docs/Web/API/Body)
`Body` 接口允许你操作响应和请求的主体部分

`Request` 和 `Response` 对象实现了 `Body` 接口

### 属性
+ [`Body.bodyUsed`](https://developer.mozilla.org/en-US/docs/Web/API/Body/bodyUsed)
### 方法
+ [`Body.arrayBuffer()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer)
+ [`Body.blob()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/blob)
+ [`Body.formData()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/formData)
+ [`Body.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json)
+ [`Body.text()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/text)
 
## [Requset](https://developer.mozilla.org/en-US/docs/Web/API/Request)
### [`Request()`](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)
用法: `const myRequest = new Request(input[, init])`

***input***： 代表你想要请求的资源，它可以是下面这些值：
+ 一个直接包含你想要 fetch 的资源的 URL 的 [`USVString`]()
+ 另一个 `Request` 对象。

***init***：可选的选项对象，包含你想要应用到请求中的自定义设置，可以包含下面这些选项：
+ `method`: 请求的方法，例如：`GET`, `POST`。
+ `headers`: 请求头，可以是一个预先创建的 `Headers` 对象，或者是一个包含选项的对象字面量。
+ `body`: 任何你想要添加到请求中的 body，可以是一个 `Blob`, `BufferSource`, [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams), `USVString` 等对象。注意 `GET` 和 `HEAD` 请求不能包含这个选项。
+ `mode`: 请求的模式，可以是 `'cors'`, `'no-cors'`, `'same-origin'`, `'navigate'`
+ `'credentials'`: 请求证书，可以是 `'omit'`, `'same-origin'`, `'include'`
+ `cache`: [cache 模式](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)，可以是 `'default'`, `'no-store'`, `'reload'`, `'no-cache'`, `'force-cache'`, `'only-if-cached'`
+ `redirect`: 重定向模式，可以是 `'follow'`, `'error'`, `'manual'`
+ `referrer`:
+ `integrity`:

### Properties
#### [Request.cache](https://developer.mozilla.org/en-US/docs/Web/API/Request/cache)
read-only 属性，表示请求的 cache 模式，用来控制请求与浏览器的 [HTTP cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) 的交互方式。

用法：`let currentCacheMode = request.cache`

这个属性有以下可能的值
+ `default`: 浏览器在它的 HTTP cache 里查找与当前请求匹配的请求
  + 如果存在匹配的请求，而且是新的，将直接从浏览器 cache 里返回请求的资源。
  + 如果存在匹配的请求，但是是旧的，这时浏览器会向远程服务器发起一个条件请求 ([conditional request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests))，如果服务器指示请求的资源到目前还没有更改过，那么将直接从浏览器 cache 里返回请求的资源。否则，资源从服务器返回，同时更新浏览器的 cache。
  + 如果不存在匹配的请求，浏览器将向远程服务器发起一个常规请求，然后使用请求的资源更新 cache
+ `no-store`: 浏览器直接从远程服务器请求资源，不会去检查 cache，而且也不会去更新 cache
+ `reload`: 浏览器直接从远程服务器请求资源，不会去检查 cache，但会用请求的资源去更新 cache
+ `no-cache`: 浏览器在它的 HTTP cache 里查找与当前请求匹配的请求
  + 如果存在匹配的请求，不管是新的还是旧的，浏览器都会向远程服务器发起一个条件请求 ([conditional request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests))，如果服务器指示请求的资源到目前还没有更改过，那么将直接从浏览器 cache 里返回请求的资源。否则，资源从服务器返回，同时更新浏览器的 cache。
  + 如果不存在匹配的请求，浏览器将向远程服务器发起一个常规请求，然后使用请求的资源更新 cache
+ `force-cache`: 浏览器在它的 HTTP cache 里查找与当前请求匹配的请求
  + 如果存在匹配的请求，不管是新的还是旧的，都直接从浏览器 cache 里返回请求的资源。
  + 如果不存在匹配的请求，浏览器将向远程服务器发起一个常规请求，然后使用请求的资源更新 cache
+ `only-if-cached`: 浏览器在它的 HTTP cache 里查找与当前请求匹配的请求
  + 如果存在匹配的请求，不管是新的还是旧的，都直接从浏览器 cache 里返回请求的资源。
  + 如果不存在匹配的请求，浏览器将呈现 [504 Gateway timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) 状态。
> 注意：只有当请求的模式 (`mode`) 是 `'same-origin'` 时，`cache` 才能使用 `'only-if-cached'` 模式。

#### [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
read-only 属性，用来指示浏览器在跨域请求时，是否应该发送 cookies，它有下列三个可能的值：
+ `omit`: 不发送 cookies
+ `same-origin`: 如果是同域请求，发送 cookies。（默认为该值）
+ `include`: 总是发送 cookies，即使是跨域请求
#### [Request.headers](https://developer.mozilla.org/en-US/docs/Web/API/Request/headers)
read-only 属性，请求头对象: `let headers = request.headers`
#### [Request.mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)
read-only 属性，请求的模式，它的值决定了跨域请求能否产生可用的响应，以及响应的哪些属性是可读的。它有下面这些可能的值:
+ `some-origin`：只能发送同域请求，任何跨域请求都将导致错误。
+ `no-cors`：
+ `cors`：允许跨域请求，例如访问第三方提供的各种各样的 API。
+ `navigate`
## Response

## 跨域资源共享 [CORS (Cross Origin Resource Sharing)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
跨域资源共享 (CORS) 是一种机制，它使用额外的 HTTP 头去告诉浏览器，让运行在某个域上的 web 应用有权访问另一个域上的服务器上的资源。web 应用程序在请求与其自己不同源的资源时，就会发出跨源 HTTP 请求。

出于安全原因，浏览器会限制从脚本中发起的跨源请求。例如，`XMLHttpRequest` 和 Fetch API 都遵循同源策略。这意味着，使用这些 API 的 web 应用只能请求与其本身同源的资源，除非来自其它源的响应包含正确的 CORS 头。

CORS 标准的工作原理是，服务器通过添加新的 HTTP 头信息来描述允许哪些请求源可以使用浏览器来跨源访问这里的资源。此外，对于会对服务器端的数据产生副作用的 HTTP 请求方法，CORS 规范要求浏览器先使用 HTTP OPTIONS 方法发送预检 (preflight) 请求，来询问服务器是否支持该请求方法，在得到目标服务器的批准后，浏览器再发送真正的 HTTP 请求。服务器同时还可以在响应头信息中指示客户端是否应该随请求一起发送 credentials (包括 cookies 和 HTTP 身份认证信息)。

CORS 失败时会导致错误，但是出于安全原因，JavaScript 代码无法使用关于错误的详细信息，代码仅仅只是知道有错误发生。要想知道到底发生了什么错误，你只能去查看浏览器的控制台。

### 简单请求 (Simple Requests)
有些请求不会触发 CORS 预检，这些请求称为**简单请求**。满足下面所有条件的请求是一个简单请求：
+ 请求方法是以下之一：
  - `GET`
  - `HEAD`
  - `POST`

### 预检请求 (Preflighted Requests)