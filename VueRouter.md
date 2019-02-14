# Vue Router

## 动态路由匹配（Dynamic Route Matching）
一个常见的需求是需要用同一个组件去匹配一个给定的路由模式，例如，我们有一个 `User` 组件，我们需要为所有用户 (带有不同的ID) 都渲染这个组件，通过 `vue-router` 的路径 dynamic segment 可以解决这个问题：
```js
const User = {
    template: '<div>User</div>'
}

const router = new VueRouter({
    routes: [
        // dynamic segments start with a colon
        { path: '/user/:id', component: User }
    ]
})
```
现在，像 `/user/foo`,  `/user/bar` 这样的 url，都将匹配到同一个路由。

使用符号 `:` 来指示一个 dynamic segment，当路由被匹配，dynamic segment 的值将暴露在每一个组件的 `this.$route.params` 中，因此，我们可以在 `User` 组件中渲染出当前用户的 ID:
```js
const User = {
    template: '<div>{{$route.params.id}}</div>'
}
```
在一个 path 中你可以有多个 dynamic segment，它们的值会被映射到 `$route.params` 中的对应字段：

|             pattern             |       matched path        |             $route.params              |
| :-----------------------------: | :-----------------------: | :------------------------------------: |
| `/user/:username/post/:post_id` | `/user/nicholas/post/123` | `{username: 'nicholas', post_id: 123}` |

### 对路由参数变化的响应（Reacting to Params Changes）
使用带参数的路由时，有一点需要注意，当用户从 `/user/foo` 导航到 `/user/bar` 时, 因为这两个路由将渲染同一个组件，所以组件实例将会被重用，因为这比销毁旧实例再创建新实例更有效率。同时这也意味着，组件的生命周期钩子（lifecycle hooks）不会被调用。

为了响应参数的变化，可以在组件内直接监听 `$route` 对象：
```js
const User = {
    template: '...',
    watch: {
        '$route' (to, from) {
            // react to route change
        }
    }
}
```
或者使用 `beforeRouteUpdate` 导航守卫（navigation guard）：
```js
const User = {
    template: '...',
    beforeRouteUpdate (to, from, next) {
        // react to route change
    }
}
```
### 匹配优先级（Matching Priority）
有时，一个 URL 可能被多个路由匹配，这个时候匹配的优先级取决于路由定义的顺序，先定义的路由有更高的优先级。

更多关于路由匹配的用法请参考[高级匹配模式](https://router.vuejs.org/guide/essentials/dynamic-matching.html#advanced-matching-patterns)。

## 嵌套路由（Nested Routes）
一个路由匹配的组件也可以包含它自己的 `<router-view>`，例如在 `User` 组件中添加这样一个嵌套的出口(outlet):
```js
const User = {
    template: `
    <div class="nested">
        <div>{{$route.params.id}}</div>
        <router-view></router-view>
    </div>
    `
}
```
为了将某个组件渲染到这个嵌套的出口（nested outlet），需要在路由配置对象中添加 `children` 选项：
```js
const router = new VueRouter({
    routes: [
        { 
            path: '/user/:id',
            component: User,
            children: [
                {
                    // 当 /user/:id/profile 被匹配时，
                    // UserProfile 将被渲染到 User 内的 <router-view> 处
                    path: 'profile',
                    component: UserProfile
                },
                {
                    // 当 /user/:id/posts 被匹配时，
                    // UserPosts 将被渲染到 User 内的 <router-view> 处
                    path: 'posts',
                    component: UserPosts
                }
            ]
        }
    ]
})
```
> 注意：当嵌套路径以 `/` 开头时，会被当作是根路径，这意味着你可以只使用嵌套出口，而不必使用嵌套 url。

正如上面看到的那样，`children` 选项和 `routes` 一样，也是一个包含路由配置对象的数组，所以只要你愿意，你可以继续嵌套下去。

## 命名路由（Named Routes）
有时候给路由指定一个名字会更加方便：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```
这样你就可以通过给 `router-link` 组件的 `to` 属性绑定一个对象来链接这个路由：
```html
<router-link :to="{name: 'user', params: { userId: 123 }}">User</router-link>
```
或者使用编程式导航：
```js
router.push({name: 'user', params: { userId: 123 }})
```

## 命名视图（Named Views）
有时候你可能需要同时展示多个视图，而不是嵌套它们，这正是命名视图的用武之地。不是只有一个单一的渲染出口 (`router-view`)，你可以有多个渲染出口，并且给每个出口提供一个 `name` 属性，没有提供 `name` 的 `router-view` 默认将 `default` 作为它的名字：
```html
<router-view></router-view>
<router-view name="a"></router-view>
<router-view name="b"></router-view>
```
一个路由要渲染多个出口，那就需要提供多个组件，使用 `components` 选项为某个路由指定多个组件：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```
更多关于命名视图的用法请参考[这里](https://router.vuejs.org/guide/essentials/named-views.html#nested-named-views)。

## 重定向和别名（Redirect and Alias）
### Redirect
将 `/a` 重定向到 `/b`：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      redirect: '/b'
    }
  ]
})
```
也可以重定向到一个命名路由：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      redirect: { name: 'foo' }
    }
  ]
})
```
甚至可以使用函数来动态重定向：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      redirect: to => {
        // 这个函数接受目标路由对象作为它的参数，返回重定向的 path/location
      }
    }
  ]
})
```
注意，导航守卫 (Navigation Guards)不会应用到被重定向的路由，只会应用到目标路由。例如上面的例子中为 `/a` 路由添加 `beforeEnter` 钩子，不会有任何效果。

更多高级用法请参考[这里](https://router.vuejs.org/guide/essentials/redirect-and-alias.html#redirect)

### Alias
`/a` 重定向到 `/b` 的意思是：当你访问 `/a`时，URL 会被替换成 `/b`，然后匹配 `/b` 对应的路由。而 `/a` 的别名是 `/b`，意味着，当你访问 `/b` 时，URL 还是 `/b`，但是将会匹配 `/a` 对应的路由，也就是说访问 `/b` 和访问 `/a` 是一样的效果：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/a',
      component: A,
      alias: '/b'
    }
  ]
})
```
## 传递 Props 给路由组件
在你的组件中使用 `$route` 对象，会使你的组件与路由形成紧密耦合，从而限制了组件的灵活性，因为它只能被用于特定的URL。

使用 `props` 选项可以避免耦合问题：
```js
const User = {
  props: ['id'],
  template: '<div>{{id}}</div>'
}

const router = new VueRouter({
  routes: [
    {
      path: '/user/:id',
      component: User,
      props: true
    },

    // 对带有命名视图的路由对象，你必须为每个命名视图都定义 'props'
    {
      path: '/user/:id',
      components: {
        default: User,
        sidebar: Sidebar
      },
      props: {
        default: true,
        sidebar: false
      }
    }
  ]
})
```
当 `props` 被设置为 `true` 时，`$route.params` 中的字段将会作为 `prop` 传递给路由组件。

当 `props` 被设置为一个对象，它将被原样的设置为路由组件的 `props`，这对于静态的 `props` 很有用：
```js
const router = new VueRouter({
  routes: [
    {
      path: '/promotion/from-newsletter',
      component: Promotion,
      props: {
        newsletterPopup: false
      }
    }
  ]
})
```
关于 `props` 选项更高级的用法请看[这里](https://router.vuejs.org/guide/essentials/passing-props.html#function-mode)

## 编程式导航（Programmatic Navigation）
vue-router 有两种路由导航方式：声明式导航和编程式导航：

|            Declarative            |     Programmatic      |
| :-------------------------------: | :-------------------: |
|     `<router-link :to="...">`     |  `router.push(...)`   |
| `<router-link :to="..." replace>` | `router.replace(...)` |
|               ——                |    `router.go(n)`     |

> 注意：在 Vue 实例内部，通过 `$router` 来访问 router 实例。

声明式导航也是通过在内部调用对应的编程式导航的 API 来实现导航的。

`push` 和 `replace` 方法的第一个参数的类型与 `router-link` 的 `to` 属性接受的值的类型是一样的，可以是一个路径字符串，或者是一个location 描述对象：
```js
router.push('home')
router.push({path: 'home'})
router.push({name: 'user', params: {userId: 123}})
router.push({path: 'register', query: {paln: 'private'}})
```
注意，当提供了 `path`，`params` 就会被忽略（`query` 不会被忽略），所以你要么提供路由的`name`，要么手动的指定带有参数的完整的 `path`：
```js
const userId = 123
router.push({ name: 'user', params: { userId }})   // /user/123
router.push({ path: `/user/${userId}` })   //  /user/123
// params 被忽略
router.push({ path: '/user', params: { userId }})   //  /user
```
`push` 和 `replace` 方法还接受可选的 callback 作为它们的第二 (`onComplete`，导航成功后回调) 和第三个 (`onAbort`，导航失败后回调) 参数。

> 注意：如果导航目标路由与当前路由仅仅是参数变化，你必须要在路由组件内使用 `beforeRouteUpdate` 去响应路由的变化。

更多关于编程式导航的细节请看[这里](https://router.vuejs.org/guide/essentials/navigation.html)。

## 导航守卫（Navigation Guard）
顾名思义，导航守卫主要用于在路由导航时进行重定向或者取消当前导航，进而“守卫”导航。有很多钩子可以应用到路由导航的过程中。

### 全局守卫（Global Guards）
你可以使用 `router.beforeEach` 注册全局导航前守卫(global before guards)：
```js
const router = new VueRouter({ ... })
 router.beforeEach((to, from, next) => {
     // ...
 })
```
无论什么时候有导航被触发，全局导航前守卫都会按照它们被创建的顺序调用，此时导航处于等待状态，直到所有守卫钩子被解析。

每个守卫函数接收三个参数：
- `to: Route`: 将要导航到的目标路由对象
- `from: Route`: 当前将要离开的路由对象
- `next: Function`：必须要调用这个函数来解析这个钩子，这个函数产生的效果取决于提供给它的参数：

  - `next()` : 执行 pipeline 中的下一个钩子，如果没有排队的钩子，导航被确认。
  - `next(false)`:终止当前导航。如果浏览器的 url 被改变，它将被设置为 `from` route。
  - `next('/')` 或 `next({path: '/'})`: 重定向到指定的路由，当前的导航将被中断，新的导航将开始。
  - `next(error)`: 如果传给 `next` 的是 `Error` 的一个实例，导航将被终止，同时 `error` 将会传给通过 `router.onError()`注册的回调函数。

> 确保总是调用 `next` 函数，否者钩子不会被解析。

对应的有 `afterEach` 全局钩子：
```js
router.afterEach((to, from) => {
  // ...
})
```
不同的是这个钩子函数不接受 `next` 参数，它对导航不产生影响。

### 全局解析守卫 （Global Resolve Guard）
你也可以通过 `router.beforeResolve` 注册全局守卫，这个钩子在导航被确认之前，且所有的钩子被解析之后调用。看[这里](https://router.vuejs.org/guide/advanced/navigation-guards.html#global-resolve-guards)。

### 路由内守卫 （Pre-Route Guard）
你可以直接在路由配置对象里定义 `beforeEnter` 守卫:
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        // 接受与全局守卫完全相同的参数 
      }
    }
  ]
})
```
> 注意 路由参数或者查询字符串的变化不会触发 `enter/leave` 导航守卫，你可以在组件内监听（`watch`）`$route` 对象，或者用组件内守卫 `beforeRouteUpdate` 去响应它们的变化。

### 组件内守卫 (In-Component Guards)
你可以直接在路由组件里定义导航守卫：

- `beforeRouteEnter`
- `beforeRouteUpdate`
- `beforeRouteLeave`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // called before the route that renders this component is confirmed.
    // does NOT have access to `this` component instance,
    // because it has not been created yet when this guard is called!
  },
  beforeRouteUpdate (to, from, next) {
    // called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // For example, for a route with dynamic params `/foo/:id`, when we
    // navigate between `/foo/1` and `/foo/2`, the same `Foo` component instance
    // will be reused, and this hook will be called when that happens.
    // has access to `this` component instance.
  },
  beforeRouteLeave (to, from, next) {
    // called when the route that renders this component is about to
    // be navigated away from.
    // has access to `this` component instance.
  }
}
```
`beforeRouteEnter` 不能访问 `this` 对象，因为此时组件实例还没被创建，但是 `beforeRouteEnter` 的 `next` 可以接受一个 callback 作为参数，这个 callback 将在导航被确认后调用，同时会将组件实例传递给它：
```js
beforeRouteEnter (to, from, next) {
  next(vm => {
    // access to component instance via `vm`
  })
}
```
> 注意：`beforeRouteEnter` 是唯一支持传递回调函数给 `next` 的守卫。对于 `beforeRouteUpdate` 和 `beforeRouteLeave` 守卫，`this` 已经是直接可用的，所以没必要再通过回调来访问实例。

更多关于导航守卫的细节看[这里](https://router.vuejs.org/guide/advanced/navigation-guards.html#navigation-guards)。

## 路由元信息 （Route Meta Fields）
你可以在路由配置对象中包含一个 `meta` 字段:
```js
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      // a meta field
      meta: { title: 'home' }
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})
```
在路由配置中的每一个路由对象被称作一条路由记录 (route record), 路由记录可以嵌套，因此当一个路由被匹配时，它可能匹配了多条路由记录。

例如，对于上面的路由配置，`/foo/bar` 将匹配父路由记录和子路由记录，一个路由匹配的所有路由记录都将被暴露到 Vue 实例（包含导航守卫钩子函数接受的 route 对象）的 `$route.matched` 数组中，这样的话，我们就可以通过遍历 `$route.matched` 去检查路由记录中的 `meta` 字段：
```js
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // make sure to always call next()!
  }
})
```

## 获取数据 （Data Fetching）
有时你可能需要在某个路由被激活时从服务器获取数据，有两种实现方式：
+ 导航后获取（Fetching After Navigation）

    使用这种方式时，会先立刻执行导航和组件渲染，然后在组件的 `created` 钩子中 fetch 数据
+ 导航前获取（Fetching Before Navigation）

    使用这种方式，可以在将要渲染的路由组件里的 `beforeRouteEnter` 钩子中 fetch 数据, 然后在 fetch 结束后，调用 `next` 即可。

更多细节请看[这里](https://router.vuejs.org/guide/advanced/data-fetching.html#fetching-after-navigation)。

## 滚动行为（Scroll Behavior） 
当使用前端路由时，我们可能希望当导航到一个新路由时，页面滚动到顶端或者保持它先前的位置。`vue-router` 允许你在路由导航时完全定制页面的滚动行为。
> 注意，这个特性只有当你的浏览器支持 `history.pushState` API 时才会工作。

当创建路由实例时，你可以提供一个 `scrollBehavior` 函数:
```js
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // 返回你期望的滚动位置
  }
})
```
只有通过浏览器的前进/后退按钮触发导航时，`scrollBehavior` 函数的第三个参数 `savedPosition` 才可用。

这个函数可以返回一个包含滚动位置信息的对象，可以是如下的形式：
+ `{ x: number, y: number }`
+ `{ selector: string, offset?: {x: number, y: number }}`

例如：
```js
scrollBehavior (to, from, savedPosition) {
  return { x: 0, y: 0 }
}
```
这将使得对所有的路由导航，页面都会滚动到顶部。

如果返回 `savedPosition`，当使用浏览器的前进/后退按钮时，会有类似原生的滚动行为：
```js
scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  } else {
    return { x: 0, y: 0 }
  }
}
```
如果你想模拟滚动到锚点 (scroll to anchor) 的行为:
```js
scrollBehavior (to, from, savedPosition) {
  if (to.hash) {
    return {
      selector: to.hash,
      // offset: { x: 0, y: 10 }
    }
  }
}
```
如果结合路由元信息，还可以实现更细粒度的滚动控制。详细请看[这里](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html#%E5%BC%82%E6%AD%A5%E6%BB%9A%E5%8A%A8)。

如果 `scrollBehavior` 返回的是一个 falsy 值，或者是一个空对象，将不会发生滚动行为。

## 路由懒加载 (Lazy Loading Routes)

如果能把每个路由对应的组件分割成单独的代码块，在路由被访问时再去加载对应的代码块。这样会更高效，能提高页面加载性能。

结合 Vue 的异步组件特性和 webpack 的代码分割功能可以很容易的实现路由懒加载。

首先, 异步组件可以被定义为一个返回 Promise (resolve 组件自身) 的工厂函数：
```js
const Foo = () => Promise.resolve({ /* component definition */ })
```
然后，使用动态 `import` 语法来为 webpack 指示一个代码分割点：
```js
import('./Foo.vue') // returns a Promise
```
结合这两点，就能很容易地定义一个能被 webpack 进行代码分割的异步组件：
```js
const Foo = () => import('./Foo.vue')
```
而在路由配置中，什么都不用改：
```js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})

```
### 把组件按组分块
有时我们可能需要把同一个路由匹配的所有嵌套的组件分割到同一个代码块中，通过使用 webpack 特殊的注释语法来提供代码块的名字，可以实现分组的目的：
```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```
webpack 会将所有带有相同 `webpackChunkName` 的异步模块分割到同一个异步代码块中。