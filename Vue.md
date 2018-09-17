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

## Vue 实例属性 
### vm.$data
Vue 实例监视的 data 对象，Vue 实例也代理了 data 的属性的访问权(以 `'_'` 和 `'$'` 开头的属性除外)：
```js
export default {
  //...
  data () {
    return {
      foo: 333
    }
  },
  created () {
    // 通过 Vue 实例代理访问 data 对象上的属性
    console.log(this.foo) // => 333
    // 通过实例属性 $data 访问
    console.log(this.$data.foo) // => 333
  }
}
```
> 注意：Vue 实例不代理访问以 `'_'` 和 `'$'` 开头的属性，对于这样的属性，你只能使用 `$data` 来访问。

### vm.$props
一个包含组件当前接收的props的对象，Vue 实例也代理了它 props 选项的属性的访问权：
```js
//Parent.vue
<Child propA="hello"/>

// Child.vue
export default {
  // ...
  name: 'child',
  props：['propA'],
  created () {
    // 通过 Vue 实例代理访问 props 上的属性
    console.log(this.propA) // => 'hello'
    // 通过实例属性 $props 访问
    console.log(this.$props.propA) // => 'hello'
  }
}
```

### vm.$el
Vue 实例挂载的根 DOM 元素

### vm.$options
用于访问自定义选项数据：
```js
new Vue({
  customOption: 'foo',
  created: function () {
    console.log(this.$options.customOption) // => 'foo'
  }
})
```

### vm.$parent
如果当前实例有父实例，则代表父实例对象，可以访问父实例的数据

### vm.$root
当前组件树的根 Vue 实例，如果当前实例没有父实例，则这个值就是它本身。

### vm.$children
当前实例的直接子组件实例的数组，注意，这个数组不保证子实例的顺序，而且也不是响应式的。详情看[这里](https://vuejs.org/v2/api/#vm-children)。

### vm.$slots
用于编程式的访问通过插槽 (slot) 分发的内容，通常在写渲染函数 (render function) 时使用，对于具名插槽 (named slot) 分发的内容将被映射到这个对象的同名字段，例如，分发内容带有 `slot="foo"` 属性，那么它将被映射到 `vm.$slots.foo`，而 `vm.$slots.default` 包含所有未命名插槽分发的内容。详情看[这里](https://vuejs.org/v2/api/#vm-slots)。

### vm.$scopedSlots
用于编程式的访问通过作用域插槽 (scoped slot) 分发的内容。详情看[这里](https://vuejs.org/v2/api/#vm-scopedSlots)。

### vm.$refs
一个包含通过 `ref` 属性注册过的 DOM 元素 和 组件实例的对象，例如，如果在一个原生 HTML 元素上注册了 `ref='foo'` 属性，那么 `vm.$refs.foo` 就代表了这个 DOM 元素，可以直接对它进行 DOM 操作。如果在一个组件上注册了 `ref='bar'` 属性，那么`vm.$refs.bar` 就代表了这个组件实例，可以直接操作它的数据。详情看[这里](https://vuejs.org/v2/api/#vm-refs)。

### vm.$isServer
boolean 值，表示当前 Vue 实例是否运行在服务器端。

### vm.$attrs
包含父作用域内的绑定的 non-prop 属性的键值对 (`class` 和 `style` 属性除外)。也就是说，如果组件自身没有声明任何 props，那么这个对象包含父作用域内绑定的所有属性的键值对 (`class` 和 `style` 属性除外)，可以使用 `v-bind="$attrs"` 将其传递到组件内部的任何元素上。详情请看[这里](https://forum.vuejs.org/t/attrs/42178)。

### vm.$listeners
包含父作用域内 `v-on` 绑定的事件监听器(没有 `.native` 修饰符)，当你想要在父作用域内监听组件内部某个元素触发的原生事件 (非 `this.$emit` 触发的事件) 时，可以将 `$listeners` 绑定到那个元素上：`v-on="$listeners"`。详情请看[这里](https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components)。

## Vue 实例方法
### vm.$watch(expOrFn, callback, [options])
在 Vue 实例中监听一个表达式或一个 computed function 的变化，callback 接受 new value 和 old value 作为参数，且当监听的依赖发生变化时被调用。当监听的是表达式时，只接受以 `.` 为分隔路径的表达式。对于更复杂的表达式，请使用 computed function 代替：
```js
export default {
  data () {
    return {
      a: {
        b: {
          c: 'abc'
        }
      },
      d: 1,
      e: 2
    },
    created () {
      // 监听表达式
      this.$watch('a.b.c', function (newVal, oldVal) {
        // 当 this.a.b.c 的值改变时，被调用
      })

      // 监听 computed function
      this.$watch(function () {
        return this.d + this.e
      }, function (newVal, oldVal) {
        // 当 this.d + this.e 的值发生变化是，被调用
      })
    }
  }
}
```
`vm.$watch` 返回一个 unwatch function，用来解绑 callback：
```js
let unwatch = vm.$watch('a', callback)
unwatch() // 之后，a 变化也不会触发 callback
```
更改一个对象内部的值，不会触发它的监听函数，因为 newVal 和 oldVal 引用同一个对象，如果要监听一个对象内部的变化，给 `$watch` 传递 `{deep: true}` 作为第三个参数：
```js
vm.$watch('someObject', callback, {
  deep: true
})

vm.someObject.nestedValue = 123
// callback 被调用
```
更多用法请看[这里](https://vuejs.org/v2/api/#vm-watch)。
### vm.$set(target, key, value)
This is the alias of the global [`Vue.set`](https://vuejs.org/v2/api/#Vue-set).
### vm.$delete(target, key)
This is the alias of the global [Vue.delete](https://vuejs.org/v2/api/#Vue-delete).
### vm.$on(event, callback)
在当前 Vue 实例中监听在当前实例中自定义的事件(由 `vm.$emit` 触发的事件)，注意，触发和监听必须是在同一个实例中！在父作用域中只能使用`v-on`监听，使用`$on`监听无效，
```js
vm.$on(`test`, function (msg) {
  console.log(msg)
})
vm.$emit('test', 'hi')
// => 'hi'
```
### vm.$once(event, callback)
监听自定义事件，但是 callback 只在事件第一次触发时被调用一次，之后被移除。

### vm.$off([event, callback])
移除自定义事件的 callback。两个参数都可选，详情请看[这里](https://vuejs.org/v2/api/#vm-off)。

### vm.$emit(eventName, [...args])
在当前 Vue 实例中触发 eventName 事件，并将 args 传递给该事件的 callback function。详情请看[这里](https://vuejs.org/v2/api/#vm-emit)。
### vm.$mount([elementOrSelector])
如果 Vue 实例在实例化时不存在 `el` 选项，它将处于未挂载状态，即没有与之关联的 DOM 元素。如果你没有提供 `el`选项，你可以：
```js
const myComponent = Vue.extend({
  template: '<div>hello</div>'
})

// create and mount to #app (will replace #app)
new myComponent().$mount('#app')
```
### vm.$forceUpdate()
Force the Vue instance to re-render. Note it does not affect all child components, only the instance itself and child components with inserted slot content.
### vm.$nextTick([callback])
callback将在下一次 DOM 更新周期之后执行。当你更改了某些数据后可以立即调用这个方法，然后等待DOM更新。这个方法与全局方法 `vue.nextTick` 类似，不同之处是这个方法的 callback 的 `this` 会自动绑定到当前Vue 实例对象。
### vm.$destory()
详情看[这里](https://vuejs.org/v2/api/#vm-destroy)。

## 内建指令
### v-on
当该指令用于原生 html 元素时，监听的是原生DOM事件，当该指令用于组件时，监听的是组件自定义事件(`$emit` 触发):
```
<!-- 这里监听的是原生 click 事件 -->
<button @click="handler1">click</button>

<!-- 这里监听的是组件自定义的 click 事件 -->
<myButton @click="handler2"></myButton>
```
如果要在组件上监听原生 DOM 事件，可以使用 `.native` 修饰符：
```
<!-- 这里监听的是组件根元素上的原生 click 事件 -->
<myButton @click.native="handler2"/>
```
> 注意：使用 `.native` 修饰符始终是监听组件根元素上的原生事件。要监听根元素内部的原生事件请使用 `$listeners`。

`v-on` 绑定的表达式可以是一个方法名，或者是一个内联语句 (inline statement)，当存在修饰符时，也可以不提供表达式。当监听的是原生 DOM 事件时，如果绑定表达式是一个方法名 (method name)，该方法会接受原生 event 对象作为唯一参数 (在方法内部，`event` 对象始终可以访问)：
```html
<template>
  <button @click="handler">click</button>
</template>

<script>
export default {
  // ...
  methods: {
    // 接受原生事件对象作为唯一参数
    handler (e) {
      // e 是原生事件对象
      console.log(e.target.nodeName) // => BUTTON

      //事实上原生事件对象始终可以通过 event 来访问
      console.log(event.target.nodeName) // => BUTTON
    }
  }
}
</script>
```
如果绑定的表达式是一个内联语句，这个语句可以访问特殊的 `$event` 属性, 它代表原生事件对象：
```html
<template>
  <!-- 使用 inline statement，可以为事件处理函数传递任意多个参数，特别地，$event 代表原生事件对象 -->
  <button @click="handler('hello','world',$event)">click</button>
</template>

<script>
export default {
  // ...
  methods: {
    // 当事件处理函数需要额外参数时，在v-on 中使用 inline statement
    handler (p1, p1, e) {
      console.log(p1) // => 'hello'
      console.log(p1) // => 'world'
      // e 是原生事件对象
      console.log(e.target.nodeName) // => BUTTON

      //事实上原生事件对象始终可以通过 event 来访问
      console.log(event.target.nodeName) // => BUTTON
    }
  }
}
</script>
```
`v-on` 还可以绑定一个包含 eventName/handler 键值对的对象：
```html
<button v-on="{mousedown: handler1, mouseup: handler2}"></button>

<!-- 这等价于 -->
<button @mousedown="handler1" @mouseup="handler2"></button>
```