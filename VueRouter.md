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
<table>
<tr>
<th>pattern</th>
<th>matched path</th>
<th>$route.params</th>
</tr>
<tr>
<td>/user/:username/post/:post_id</td>
<td>/user/nicholas/post/123</td>
<td>{ username: 'nicholas', post_id: 123}</td>
</tr>
</table>

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