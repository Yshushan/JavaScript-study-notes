# 动态路由匹配（Dynamic Route Matching）
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

|pattern|matched path|$route.params|
|:----:|:----:|:----:|
|`/user/:username/post/:post_id`|`/user/nicholas/post/123`|`{username: 'nicholas', post_id: 123}`|

## 对路由参数变化的响应（Reacting to Params Changes）
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
## 匹配优先级（Matching Priority）
有时，一个 URL 可能被多个路由匹配，这个时候匹配的优先级取决于路由定义的顺序，先定义的路由有更高的优先级。

更多关于路由匹配的用法请参考[高级匹配模式](https://router.vuejs.org/guide/essentials/dynamic-matching.html#advanced-matching-patterns)。

# 嵌套路由（Nested Routes）
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

# 命名路由（Named Routes）
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

# 命名视图（Named Views）
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

# 重定向和别名（Redirect and Alias）
## Redirect
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

## Alias
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
# 传递 Props 给路由组件
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
      componets: {
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
当 `props` 被设置为 `true`时，`$route.params` 中的字段将会作为 `prop` 传递给路由组件。

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

# 编程式导航（Programmatic Navigation）
vue-router 有两种路由导航方式：声明式导航（`<router-link>`）和编程式导航：
|Declarative|Programmatic|
|:----:|:----:|
|`<router-link :to="...">`|`router.push(...)`|
|`<router-link :to="..." replace>`|`router.replace(...)`|
|——|`router.go(n)`|

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