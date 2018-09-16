# Vue
## Mixins
Mixins 是一种灵活分发可重用功能给组件的一种方式，一个 mixin 对象可以包含任何组件选项，当一个组件使用一个 mixin 时， 这个 mixin 里的所有选项都将以适当的方式混合到组件自身的选项中：
```js
// 定义一个 mixin 对象
const myMixin = {
  data () {
    return {
      foo: 'Foo',
      bar: 'Bar'
    }
  },
  methods: {
    hello () {
      console.log('hello from mixin')
    }
  },
  created () {
    console.log('mixin hook called')
  }
}

// 在组件中引入 mixin
new Vue({
  mixins: [myMixin],
  data () {
    return {
      foo: 123
  },
  methods: {
    hello () {
      console.log('hello from component')
    }
  },
  created () {
    console.log('component hook called')
  }
})
```
### 选项合并
+ `data` 选项经行浅合并 (shallow merge，一个属性深度)，且对于同名的字段，组件自身的 `data` 有更高的优先级。
+ 钩子(hook)合并时，同名钩子的 handler 被合并到一个数组中，当该钩子触发时，所有 handler 都会被调用，且 mixin 中的钩子 handler 先于组件自身的钩子 handler 被调用。
+ 对于值是对象的选项，例如：`methods`, `computed`, `components`, `directives`，将被合并到同一个对象中，且对于同名的键，组件自身的值具有更高的优先级。

### 全局 Mixin
你可以使用 `Vue.mixin` 定义全局 mixin，但是注意，一旦你使用了全局 mixin，它将影响后面创建的每一个 Vue 实例，包括第三方组件。在大多数情况下，你只应该使用它去处理自定义选项(custom option)：
```js
Vue.mixin({
  created () {
    let myOption = this.$options.myOption
    if (myOption) {
      console.log(myOption)
    }
  }
})

new Vue({
  myOption: 'hello'
})
```
### 自定义选项合并策略 (Custom Option Merge Strategies)
合并自定义选项时，默认使用覆盖现有值的策略，如果你想为自定义选项定制合并逻辑，你需要在 `Vue.config.optionMergeStrategies` 对象上添加你的合并函数：
```js
Vue.config.optionMergeStrategies.myOption = function (toVal, fromVal) {
  // return mergedVal
}
```
对于对象类型的自定义选项，在大多数情况下你可以使用 `methods` 选项的合并策略：
```js
let strategies = Vue.config.optionMergeStrategies
strategies.myOption = strategies.methods
```
更多高级用法请看[这里](https://vuejs.org/v2/guide/mixins.html#Custom-Option-Merge-Strategies)。

## 自定义指令 (Custom Directives)
除了 Vue 内建的指令集(`v-model`, `v-show` 等等)，Vue 允许你注册你自己的指令。

虽然在 Vue 里，代码重用的主要方式应该是使用组件，但是有时候你可能需要进行底层 DOM 操作，这正是自定义指令有用的地方。

例如你想要在页面加载之后，某个元素自动获得焦点，你可以用自定义指令来实现：
```js
// 注册全局自定义指令：v-focus
// 第一个参数是指令名，第二个参数是指令定义对象
Vue.directive('focus', {
  // 当该指令绑定的元素被插入 DOM 后执行 inserted 钩子
  inserted: funtion (el) {
    // 元素聚焦
    el.focus()
  }
})
```
如果你想要注册局部指令，组件接受一个 `directives` 选项：
```js
directives: {
  focus: {
    inserted (el) {
      el.focus()
    }
  }
}
```
然后在该组件中，你可以在任何元素上使用 `v-focus`:
```html
<input v-focus>
```
### 钩子函数 (Hook Functions)
一个指令定义对象可以包含以下钩子函数：
- `bind`：只在指令第一次绑定到元素时调用一次。你可以在这个函数里进行一些一次性的设置工作。
- `inserted`：当绑定的元素被插入它的父节点之后调用。注意，只要父节点存在就行，不必要一定插入 DOM 中。
- `update`：called after the containing component’s VNode has updated, **but possibly before its children have updated.** The directive’s value may or may not have changed, but you can skip unnecessary updates by comparing the binding’s current and old values (see below on hook arguments).
- `componentUpdated`：在包含的组件的 VNode 和它们的子组件的 VNode 都更新之后调用。
- `unbind`: 当指令从元素解绑时被调用一次。
### 指令钩子函数的参数
指令的钩子函数的参数有这些：
- `el`: 指令绑定的 DOM 元素，可以直接用来进行 DOM 操作。
- `binding`: 一个包含下列属性的对象
  - `name`: 指令名，不带 `v-` 前缀。
  - `value`: 传递给指令的值，例如：`v-my-directive="1+1"`， `value` 将是 `2`。
  - `oldValue`：之前传给指令的值，仅在 `update` 和 `componentUpdated` 钩子函数中可用，无论传给指令的值是否变化，这个字段都可用。
  - `expression`: 绑定的表达式的字符串形式，例如：`v-my-directive="1+1"`， `expression` 将是 `"1+1"`。
  - `arg`：传递给指令的参数，如果有的话。例如：`v-my-directive:foo`，`arg` 将是 `"foo"`。
  - `modifiers`：一个包含修饰符的对象，如果有的话。例如：`v-my-directive.bar.baz`， `modifiers` 将是 `{foo: true, bar: true}`。
- `vnode`：由 Vue 的编译器生成的虚拟节点(virtual node)，详细看 [VNode API](https://vuejs.org/v2/api/#VNode-Interface)。
- `oldVNode`：更新前的 virtual node，仅在 `update` 和 `componentUpdated` 钩子函数中可用。

> 注意：除了 `el`，其它参数你都应该把它们当作是 read-only，不要去修改它们。如果你需要在不同钩子函数中共享一些数据，使用元素的 `dataset` API。

在大多数情况下，你可能想要 `bind` 和 `update` 钩子有相同的行为，而不关心其它钩子，你可以使用下面的简写：
```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```
如果你的指令需要多个值，你可以给它传一个对象字面量，指令可以接受任何合法的 JavaScript 表达式：
```js
<div v-demo="{ color: 'white', text: 'hello!' }"></div>

Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```

## Filters
Vue 允许你定义 filters，可以用于普通文本的格式化。有两个地方可以使用 filters： **mustache interpolations 和 `v-bind` expressions**. filters 应该放在 JavaScript 表达式的结尾，通过 `|` 符号来指示：
```html
<!-- in mustaches -->
{{ message | capitalize }}

<!-- in v-bind -->
<div v-bind:id="rawId | formatId"></div>
```
组件接受 `filters` 选项来定义 local filters：
```js
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}
```
或者在 Vue 实例之前定义全局 filters：
```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```

filter 总是接受它前面的表达式的值作为它的第一个参数，例如上面的例子中，`capitalize` 接受 `message` 的值作为它的第一个参数。

可以使用链式的 filter：
```js
{{ message | filterA | filterB }}
```
这里，`filterA` 接受 `message` 的值作为它的第一参数并先被调用，然后将返回值传给 `filterB`。

filters 可以接受额外的参数：
```js
{{ message | filterA('arg1', arg2) }}
```
这里，`filterA` 被定义成接受三个参数的函数，第一个参数始终是它前面的表达式的值，字符串字面量 `'arg1'` 将被当作第二个参数，表达式 `arg2` 的值，被当作第三个参数。