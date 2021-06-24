[面试题1](https://www.imooc.com/article/271528/#)
[面试题2](https://zhuanlan.zhihu.com/p/273341773)
[面试题3](http://bigerfe.com/)

[前端性能优化](https://zhuanlan.zhihu.com/p/121056616)

[CommonJS 和 ES Module 对比](https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1)

[HTTP、HTTPS和HTTP2](https://github.com/woai3c/Front-end-articles/blob/master/http-https-http2.md)

[跨域解决方案](https://juejin.cn/post/6844904126246027278)

- 数组
  - 更改数组自身的方法：push pop shift unshift splice reverse sort
  - 实现队列：push shift
  - 实现栈：push pop 或 shift unshift
- Promise
  - all allSettled race 的用法
    - Promise.all(): The method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises. This returned promise will resolve when all of the input's promises have resolved, or if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or non-promises throwing an error, and will reject with this first rejection message / error
    - Promise.allSettled(): The method returns a promise that resolves after all of the given promises have either fulfilled or rejected, with an array of objects that each describes the outcome of each promise. It is typically used when you have multiple asynchronous tasks that are not dependent on one another to complete successfully, or you'd always like to know the result of each promise.
    - Promise.any(): The method takes an iterable of Promise objects and, as soon as one of the promises in the iterable fulfills, returns a single promise that resolves with the value from that promise. If no promises in the iterable fulfill (if all of the given promises are rejected), then the returned promise is rejected with an AggregateError, a new subclass of Error that groups together individual errors. Essentially, this method is the opposite of Promise.all().
    - Promise.race(): The method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value or reason from that promise.
- ES2020 有哪些新特性
  - 空值合并操作符 `??`
  - 可选链操作符 `?.`
  - globalThis: 提供了一个标准的方式来获取不同环境下的全局 this  对象
  - Promise.allSettled()
  - import() 动态导入
  - String.prototype.matchAll: 返回一个包含所有匹配正则表达式的结果及分组捕获组的迭代器。
- Map 和 WeakMap 的区别
  - The WeakMap object is a collection of key/value pairs in which the keys are weakly referenced. The keys must be objects and the values can be arbitrary values.
  - WeakMap keys are not enumerable
- 什么是事件委托，target 和 currentTarget 的区别
  - 事件委托：只给父元素注册事件，通过事件冒泡机制来监听子元素的触发行为，执行相关回调
  - e.target：触发当前事件的元素
  - e.currentTarget：真正注册该事件的元素
- CommonJS 和 ES6 的模块加载方案有什么区别
  - CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
  - CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
  - CommonJs 是单个值导出，ES6 Module可以导出多个
  - CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
  - CommonJs 的 this 是当前模块，ES6 Module的 this 是 undefined
- setTimeout 和 setInterval 的区别
- JS 事件循环机制
  - 宏任务，微任务
- Vue
  - 对 mvvm 的理解
  - 什么是虚拟dom
  - Vue.use() 用法
  - vue 响应式数据原理
    - 递归遍历data 属性
    - Object.defineProperty
    - get 收集依赖 watcher
    - set 触发更新 通知 watcher 进行更新操作
  - vue 如何检测数组变化的
    - 更改原型链
    - 改写7个方法，通知视图更新
    - 对数组里的每个元素进行observe
  - vue 异步渲染
  - computed watch method 区别
  - vue3 相对 vue2 有哪些变化
    - 响应式原理不同：defineProperty/Proxy
  - vue3 的 setup 在什么时期执行

- VueRouter
  - 路由模式有哪些，又什么区别
  - 前端怎么做路由权限控制
  - 路由怎么传参

- Vuex
  - mutation 和 action 的区别


- node 模块解析过程



- 怎么解决跨域问题，有哪些方案
  - cors
  - nginx 反向代理


- NGINX
  - nginx 解决跨域的原理


- TypeScript
  - typescript 是什么
  - typescript 有哪些基本类型
  - interface 和 type alias 有什么异同
  - unknown 和 any 有什么异同，应该用哪个
  - 泛型可以用在哪些类型上
  - 模块解析过程

- Git
  - 把配置文件推送到了远程仓库，怎样删除远程仓库的该配置文件，本地还要用到这个文件
  - git stash 的用法，什么时候使用
  - git rebase 和 git merge 的区别