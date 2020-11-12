# Vue

## Hooks

- `beforeCreate`: 在实例初始化(initialized)之后，`data` observation 和 `event/watcher` 设置之前调用。
- `created`: 在实例创建完成(created)之后调用。在这个阶段，已经完成了对实例选项的处理，包括：data observation, computed properties, methods, watch/event callbacks. 但是 mounting 阶段还没开始，`$el`（实例的根 DOM 元素） 属性还不能使用。
- `beforeMount`: 在实例开始挂载(mounting)之前调用，render 函数将首次调用。
- `mounted`: 在实例被挂载之后调用。注意，此时并不保证所有子组件的实例都已被挂载，如果你想要等待整个视图都被渲染，可以在 `mounted` 中使用 `vm.$nextTick` 函数：

  ```js
  mounted: function() {
    this.$nextTick(function() {
      // 此时整个视图都已渲染完毕
    })
  }
  ```

- `beforeUpdate`: 在数据变动之后，但是 DOM 更新之前调用，这是在视图更新之前访问现有 DOM 的好地方，例如手动删除添加的事件侦听器。
- `update`: 在数据变动导致的虚拟 DOM 重新渲染(re-render) 和 patched 之后调用。在该钩子函数调用之后，组件的 DOM 将被更新，因此在这个钩子里你可以执行 DOM 相关的操作，但是在大多数情况下，你应该避免在这里更改组件的状态(state), 如果要响应状态的变化，最好使用计算属性(computed)或监听器(watch)。

  注意，同 `mounted` 钩子一样，在 `updated` 钩子阶段并不保证所有子组件的虚拟 DOM 已经 re-render 和 patched。如果你想要等待整个视图被重新渲染，可以在 `mounted` 中使用 `vm.$nextTick` 函数，同 `mounted`。

- `activated`: 当被 `keep-alive` 组件 cached 的组件重新激活时调用。
- `deactivated`: 当被 `keep-alive` 组件 cached 的组件失活时调用。
- `beforeDestroy`: Vue 实例被销毁之前调用，在这个阶段，实例还可以被正常访问。
- `destroyed`: 实例被销毁之后调用。当这个钩子被调用， 所有的指令被解绑，所有的事件监听器被移除，所有的子组件实例也被销毁。

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

- `data` 选项经行浅合并 (shallow merge，一个属性深度)，且对于同名的字段，组件自身的 `data` 有更高的优先级。
- 钩子(hook)合并时，同名钩子的 handler 被合并到一个数组中，当该钩子触发时，所有 handler 都会被调用，且 mixin 中的钩子 handler 先于组件自身的钩子 handler 被调用。
- 对于值是对象的选项，例如：`methods`, `computed`, `components`, `directives`，将被合并到同一个对象中，且对于同名的键，组件自身的值具有更高的优先级。

### 全局 Mixin

你可以使用 `Vue.mixin` 定义全局 mixin，但是注意，一旦你使用了全局 mixin，它将影响后面创建的每一个 Vue 实例，包括第三方组件。在大多数情况下，你只应该使用它去处理自定义选项(custom option)：

```js
Vue.mixin({
  created() {
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
Vue.config.optionMergeStrategies.myOption = function(toVal, fromVal) {
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
<input v-focus />
```

### 钩子函数 (Hook Functions)

一个指令定义对象可以包含以下钩子函数：

- `bind`：只在指令第一次绑定到元素时调用一次。你可以在这个函数里进行一些一次性的设置工作。
- `inserted`：当绑定的元素被插入它的父节点之后调用。注意，只要父节点存在就行，不必一定要插入 DOM 中。
- `update`：called after the containing component’s VNode has updated, **but possibly before its children have updated.** The directive’s value may or may not have changed, but you can skip unnecessary updates by comparing the binding’s current and old values (see below on hook arguments).
  在当前绑定的组件的 VNode 更新之后调用，但是有可能在它的子组件更新之前调用，调用时，指令绑定的值可能改变也可能没改变，可以通过比较当前绑定的值 `value` 与之前传递给指令的值 `oldValue` 来跳过不必要的更新。
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
  - `modifiers`：一个包含修饰符的对象，如果有的话。例如：`v-my-directive.bar.baz`， `modifiers` 将是 `{bar: true, baz: true}`。
- `vnode`：由 Vue 的编译器生成的虚拟节点(virtual node)，详细看 [VNode API](https://vuejs.org/v2/api/#VNode-Interface)。
- `oldVNode`：更新前的 virtual node，仅在 `update` 和 `componentUpdated` 钩子函数中可用。

> 注意：除了 `el`，其它参数你都应该把它们当作是 read-only，不要去修改它们。如果你需要在不同钩子函数中共享一些数据，使用元素的 `dataset` API。

在大多数情况下，你可能想要 `bind` 和 `update` 钩子有相同的行为，而不关心其它钩子，你可以使用下面的简写：

```js
Vue.directive('color-swatch', function(el, binding) {
  el.style.backgroundColor = binding.value
})
```

如果你的指令需要多个值，你可以给它传一个对象字面量，指令可以接受任何合法的 JavaScript 表达式：

```js
;<div v-demo="{ color: 'white', text: 'hello!' }" />

Vue.directive('demo', function(el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text) // => "hello!"
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
Vue.filter('capitalize', function(value) {
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
{
  {
    message | filterA | filterB
  }
}
```

这里，`filterA` 接受 `message` 的值作为它的第一参数并先被调用，然后将返回值传给 `filterB`。

filters 可以接受额外的参数：

```js
{
  {
    message | filterA('arg1', arg2)
  }
}
```

这里，`filterA` 被定义成接受三个参数的函数，第一个参数始终是它前面的表达式的值，字符串字面量 `'arg1'` 将被当作第二个参数，表达式 `arg2` 的值，被当作第三个参数。

> 注意： filter 内的 `this` 并不指向当前 Vue 实例，所以不能在 filter 中通过 `this` 访问实例属性。实际上 filter 的设计只是为了方便对文本经行简单的格式化，不应在 filter 中进行复杂的逻辑操作，如果需要对数据进行复杂的转换，请使用 `computed`。

## [provide / inject](https://vuejs.org/v2/api/#provide-inject)

通过依赖注入的方式，让所有后代组件都能直接访问**根父组件**的内部的属性。

在**根父组件**内通过 `provide` 选项指定想要提供给后代组件的数据或方法，在后代组件中通过 `inject` 选项接收需要的数据和方法：

```js
// root parent
provide: function() {
  return {
    commonData: this.foo,
    commonMethod: this.bar
  }
}

// descendant components
inject: ['commonData', 'commonMethod']
```

相较通过 `$parent` 实例方法访问父组件的实例而言，通过 `provide/inject` 依赖注入的方式有以下优点：

- 不论子组件嵌套有多深，只要它是根父组件的后代，都可以直接访问根父组件注入的依赖。而通过 `$parent` 只能访问上一级父组件的实例，如果需要访问更上层级的父组件就要使用 `vm.$parent.$parent...` 这种显得冗长啰嗦的方式。
- 不会将整个父组件实例暴露在子组件中，这样更加安全，不用担心不需要的父组件数据被修改。 而通过 `$parent` 会将整个父组件实例暴露。

> 注意：通过 `provide/inject` 依赖注入进行父子组件通信的方式，也有很多缺点。 它使应用重构变得困难，而且通过 `provide` 注入的数据也不是响应式的。所以你不应该在应用代码中使用 `provide/inject`, 实际上这种依赖注入方式是为开发高阶组件提供的。如果想要在后代组件中直接修改注入的数据，也许你可能需要使用状态管理 Vuex。

## Vue 实例属性

### vm.\$data

Vue 实例监视的 data 对象，Vue 实例也代理了 data 的属性的访问权(以 `'_'` 和 `'$'` 开头的属性除外)：

```js
export default {
  //...
  data() {
    return {
      foo: 333
    }
  },
  created() {
    // 通过 Vue 实例代理访问 data 对象上的属性
    console.log(this.foo) // => 333
    // 通过实例属性 $data 访问
    console.log(this.$data.foo) // => 333
  }
}
```

> 注意：Vue 实例不代理访问以 `'_'` 和 `'$'` 开头的属性，对于这样的属性，你只能使用 `$data` 来访问。

### vm.\$props

一个包含组件当前接收的 props 的对象，Vue 实例也代理了它 props 选项的属性的访问权：

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

### vm.\$el

Vue 实例挂载的根 DOM 元素

### vm.\$options

用于访问自定义选项数据：

```js
new Vue({
  customOption: 'foo',
  created: function() {
    console.log(this.$options.customOption) // => 'foo'
  }
})
```

### vm.\$parent

如果当前实例有父实例，则代表父实例对象，可以访问父实例的数据

### vm.\$root

当前组件树的根 Vue 实例，如果当前实例没有父实例，则这个值就是它本身。

### vm.\$children

当前实例的直接子组件实例的数组，注意，这个数组不保证子实例的顺序，而且也不是响应式的。详情看[这里](https://vuejs.org/v2/api/#vm-children)。

### vm.\$slots

用于编程式的访问通过插槽 (slot) 分发的内容，通常在写渲染函数 (render function) 时使用，对于具名插槽 (named slot) 分发的内容将被映射到这个对象的同名字段，例如，分发内容带有 `v-slot:foo` 指令，那么它将被映射到 `vm.$slots.foo`，而 `vm.$slots.default` 包含所有未命名插槽分发的内容。详情看[这里](https://vuejs.org/v2/api/#vm-slots)。

### vm.\$scopedSlots

用于编程式的访问通过作用域插槽 (scoped slot) 分发的内容。详情看[这里](https://vuejs.org/v2/api/#vm-scopedSlots)。

### vm.\$refs

一个包含通过 `ref` 属性注册过的 DOM 元素和组件实例的对象，例如，如果在一个原生 HTML 元素上注册了 `ref='foo'` 属性，那么 `vm.$refs.foo` 就代表了这个 DOM 元素，可以直接对它进行 DOM 操作。如果在一个组件上注册了 `ref='bar'` 属性，那么 `vm.$refs.bar` 就代表了这个组件实例，可以直接操作它的数据。详情看[这里](https://vuejs.org/v2/api/#vm-refs)。

> 注意：只有当那个被 `ref` 注册的组件被渲染之后，才能通过 `$refs` 访问到它，而且 `$refs` 访问到的子组件的数据不是响应式的，所以应该避免在组件的 templates 或 `computed` 中访问 `$refs`。

### vm.\$isServer

boolean 值，表示当前 Vue 实例是否运行在服务器端。

### vm.\$attrs

包含父作用域内的绑定的 non-prop 属性的键值对 (`class` 和 `style` 属性除外)。也就是说，如果组件自身没有声明任何 props，那么这个对象包含父作用域内绑定的所有属性的键值对 (`class` 和 `style` 属性除外)，可以使用 `v-bind="$attrs"` 将其传递到组件内部的任何元素上。详情请看[这里](https://forum.vuejs.org/t/attrs/42178)。

### vm.\$listeners

包含父作用域内 `v-on` 绑定的事件监听器(没有 `.native` 修饰符)，当你想要在父作用域内监听组件内部某个元素触发的原生事件 (非 `this.$emit` 触发的事件) 时，可以将 `$listeners` 绑定到那个元素上：`v-on="$listeners"`。详情请看[这里](https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components)。

## Vue 实例方法

### vm.\$watch(expOrFn, callback, [options])

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
        // 当 this.d + this.e 的值发生变化时，被调用
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

### vm.\$set(target, key, value)

This is the alias of the global [`Vue.set`](https://vuejs.org/v2/api/#Vue-set).

### vm.\$delete(target, key)

This is the alias of the global [Vue.delete](https://vuejs.org/v2/api/#Vue-delete).

### vm.\$on(event, callback)

在当前 Vue 实例中监听在当前实例中自定义的事件(由 `vm.$emit` 触发的事件)，注意，触发和监听必须是在同一个实例中！在父作用域中只能使用`v-on`监听，使用`$on`监听无效，

```js
vm.$on('test', function(msg) {
  console.log(msg)
})
vm.$emit('test', 'hi')
// => 'hi'
```

### vm.\$once(event, callback)

监听自定义事件，但是 callback 只在事件第一次触发时被调用一次，之后被移除。

### vm.\$off([event, callback])

移除自定义事件的 callback。两个参数都可选，详情请看[这里](https://vuejs.org/v2/api/#vm-off)。

### vm.\$emit(eventName, [...args])

在当前 Vue 实例中触发 eventName 事件，并将 args 传递给该事件的 callback function。详情请看[这里](https://vuejs.org/v2/api/#vm-emit)。

### vm.\$mount([elementOrSelector])

如果 Vue 实例在实例化时不存在 `el` 选项，它将处于未挂载状态，即没有与之关联的 DOM 元素。如果你没有提供 `el`选项，你可以使用 `$mount` 方法将其挂载在某个 DOM 上：

```js
const myComponent = Vue.extend({
  template: '<div>hello</div>'
})

// create and mount to #app (will replace #app)
new myComponent().$mount('#app')
```

### vm.\$forceUpdate()

Force the Vue instance to re-render. Note it does not affect all child components, only the instance itself and child components with inserted slot content.

### vm.\$nextTick([callback])

callback 将在下一次 DOM 更新周期之后执行。当你更改了某些数据后可以立即调用这个方法，然后等待 DOM 更新。这个方法与全局方法 `vue.nextTick` 类似，不同之处是这个方法的 callback 的 `this` 会自动绑定到当前 Vue 实例对象。

### vm.\$destory()

详情看[这里](https://vuejs.org/v2/api/#vm-destroy)。

## Vue 全局方法
### Vue.use(plugin)

用于安装一个 Vue.js 插件，参数 `plugin` 可以是一个 `Object` 或 `Function`，如果 `plugin` 是一个对象，这个对象必须暴露出一个 `install` 方法， 如果 `plugin` 是一个函数，这个函数会被当作`install` 方法。而这个 `install` 方法会被 Vue 调用，同时将 `vue` 作为参数传递给它。

注意，`Vue.use` 这个方法必须在 `new Vue()` 之前调用， 且如果对同一个 `plugin` 多次调用这个方法，这个 `plugin` 也只会被安装一次。

结合 webpack 提供的 [`require.context`](https://webpack.js.org/api/module-methods/#requirecontext) API， 可以很方便的批量全局注册组件：
```js
// src/components/index.js
const context = require.context('./global', false, /\.vue$/)

export default Vue => {
  context.keys().forEach(key => {
    const comp = context(key).default
    Vue.component(comp.name, comp)
  })
}

// src/main.js
import Vue from 'vue'
import globalComps from './components'

Vue.use(globalComps)
```

## 内建指令

### v-on

当该指令用于原生 html 元素时，监听的是原生 DOM 事件，当该指令用于组件时，监听的是组件自定义事件(由`$emit` 触发):

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
      handler(e) {
        // e 是原生事件对象
        console.log(e.target.nodeName) // => BUTTON

        //事实上原生事件对象始终可以通过 event 来访问
        console.log(event.target.nodeName) // => BUTTON
      }
    }
  }
</script>
```

如果绑定的表达式是一个内联语句，这个语句可以访问特殊的 `$event` 属性, 如果监听的是原生 DOM 事件，它代表原生事件对象：

```html
<template>
  <!-- 使用 inline statement，可以为事件处理函数传递任意多个参数，特别地，这里 $event 代表原生事件对象 -->
  <button @click="handler('hello', 'world', $event)">click</button>
</template>

<script>
  export default {
    // ...
    methods: {
      // 当事件处理函数需要额外参数时，在 v-on 中使用 inline statement
      handler(p1, p2, e) {
        console.log(p1) // => 'hello'
        console.log(p2) // => 'world'
        // e 是原生事件对象
        console.log(e.target.nodeName) // => BUTTON

        //事实上原生事件对象始终可以通过 event 来访问
        console.log(event.target.nodeName) // => BUTTON
      }
    }
  }
</script>
```

如果 `v-on` 用于组件，它监听的是组件自定义事件：

```html
<!-- child.vue -->
<!-- 在原生 click 事件里触发自定义的 custom 事件，并向上传递两个参数 -->
<template>
  <button @click="$emit('custom', 'hello', 'world')">click</button>
</template>
```

```html
<!-- parent.vue -->
<template>
  <!-- 如果使用内联语句，可以直接访问 $event 关键字，它代表子组件内部 `$emit` 传过来的参数，注意通过 $event 只能获得传过来的第一参数 -->
  <!-- 即这里 $event 是 'hello' -->
  <Child @custom="val=$event"></Child>

  <!-- 如果需要传递多个参数，请绑定方法名，而不是内联语句 -->
  <Child @custom="customHandler"></Child>
</template>

<script>
  // ...
  export default {
    // ...
    data () {
      return {
        val: ''
      }
    },
    methods: {
      // 可以接受自定义事件传递过来的任意个参数
      customHandler (p1, p2) {
        console.log(p1) // => hello
        console.log(p2 // => world
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

### [v-bind](https://vuejs.org/v2/api/#v-bind)

动态绑定表达式的值到 attribute 或者组件的 prop，当绑定的属性是 `class` 和 `style` 时，它们支持数组和对象绑定。

v-bind 支持下列修饰符：

- `.prop`：绑定的是 DOM property，而不是 HTML attribute ([看这里](https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html#answer-6004028))。如果是在组件上使用带有 `prop` 修饰符的 `v-on`，被绑定的属性将被设置到组件的`$el`上。
- `.camel`：将 kebab-case 类型的 attribute name 转换为 camel-case 类型。
- `.sync`：监听**更新绑定的值**的自定义事件的语法糖：

  ```
  <myComponent v-bind:propA.sync="someValue"/>
  <!-- 等价于 -->
  <myComponent v-bind:propA="someValue" v-on:update:propA="someValue=$event"/>
  ```
  `v-bind` 支持直接绑定一个包含 name/value 键值对的对象:

```
<myComponent v-bind="{propA: value1, propB: value2}"/>
<!-- 等价于 -->
<myComponent :propA="value1" :propB="value2"/>
```

更多关于 `v-bind` 的用法，请看[这里](https://vuejs.org/v2/api/#v-bind)。

### [v-slot](https://vuejs.org/v2/api/#v-slot)

#### Named Slots

A `<base-layout>` component with the following template:

```html
<div class="container">
  <header>
    <slot name="header"></slot>
  <header>
  <main>
    <slot></slot>  <!--A slot outlet without name implicitly has the name "default"-->
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

To provide content to named slots, we can use the `v-slot` directive on a `<template>`, providing the name of the slot as `v-slot` 's argument:

```html
<base-layout>
  <template v-slot:header>
    <h1>title</h1>
    <!--These will be passed to "header" slot-->
  </template>

  <p>paragraph 1</p>
  <!--These will be passed to default slot-->
  <p>paragraph 2</p>

  <template v-slot:footer>
    <p>copyright</p>
    <!--These will be passed to "footer" slot-->
  </template>
</base-layout>
```

However, you can still wrap default slot contents in a `<template>` if you wish to be explicit:

```html
<template v-slot:default>
  default slot contents ...
</template>
```

> Note that `v-slot` can only be added to a `<template>` (with one exception).

#### Scoped Slots

A `<current-user>` component with the following template:

```html
<span>
  <slot v-bind:user="user">
    <!--Attributes bound to a <slot> are called "slot props"-->
    {{ user.lastName }}
  </slot>
</span>
```

Now, in the parent scope, we can use `v-slot` with a value to define a name for the slot props we've been provided:

```html
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
    <!--This will replace the fallback content in <current-user>'s template-->
  </template>
</current-user>
```

In this example, we've chosen to name the object containing all our slot props slotProps, but you can use any name you like.

如果组件模板内部只有**唯一的 default slot**，那么可以不使用 `<template>`，直接将 `v-slot` 指令用于组件标签上：

```html
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
<!-- or -->
<current-user v-slot="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```

> 注意这种简写语法不能与 named slot 混用，如果模板有多个 slot, 必须为所有的 slot 提供基于 `<template>` 的完整语法。

##### Destructuring Slot Props

The value of `v-slot` can accept any valid JavaScript expression than can appear in the arugment position of a function definition. So, with the example above, you can use the object destructuring syntax to pull out specific slot props:

```html
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
<!-- You can even define fallbacks, to be used in case a slot prop is undefined -->
<current-user v-slot="{ user = { firstName: 'Nicholas' } }">
  {{ user.firstName }}
</current-user>
```

### 指令的动态参数 (Dynamic Directive Arguments)

Starting in version 2.6.0, it is also possible to use JavaScript expression in a directive argument by wrapping it with square brackets:

```html
<a v-bind:[attributeName]="url">...</a>
<!-- or -->
<a :[attributeName]="url">...</a>

<a v-on:[eventName]="doSomething">...</a>
<!-- or -->
<a @[eventName]="doSomething">...</a>

<my-component>
  <template v-slot:[slotName]
    >...</template
  >
</my-component>
<!-- or -->
<my-component>
  <template #[slotName]
    >...</template
  >
</my-component>
```

Here `attributeName` will be dynamically evaluated as a JavaScript expression, and its evaluated value will be used as the final value for the argument. Similarly, when `eventName`'s value is `"focus"`, for example, `v-on:[eventName]` will be equivalent to `v-on:focus`.

#### Dynamic Argument Value Constraints

Dynamic arguments are expected to evaluate to a string, with the exception of `null`. The special value `null` can be used to explicitly remove the binding. Any other non-string value will trigger a warning.

#### Dynamic Argument Expression Constraints

Dynamic argument expressions have some syntax constrains because certain characters are invalid inside HTML attribute names, such as spaces and quotes. For example, the following is invalid:

```html
<!-- This will trigger a compiler warning -->
<a v-bind:['foo' + bar]="value">...</a>
```

The workaround is to either use expressions without spaces or quotes, or replace the complex expression with a computed property.

## 特殊属性

### [key](https://vuejs.org/v2/api/#key)

### [ref](https://vuejs.org/v2/api/#ref)

### [slot](https://vuejs.org/v2/api/#slot)

### [is](https://vuejs.org/v2/api/#is)

## 内建组件

### [component](https://vuejs.org/v2/api/#component)

### [transition](https://vuejs.org/v2/api/#transition)

### [transition-group](https://vuejs.org/v2/api/#transition-group)

### [keep-alive](https://vuejs.org/v2/api/#keep-alive)

### [slot](https://vuejs.org/v2/api/#slot-1)





# Vue3 变动和新增特性

- `beforeDestroy` `destroyed` Lifecycle hooks 变更为 `beforeUnmount` 和 `unmounted`
- 新增了 `emits` 组件选项，用于声明该组件发出的自定义事件。[详情](https://v3.vuejs.org/guide/component-custom-events.html#defining-custom-events)
- `v-model` 指令新增 argument 和 modifier。[详情](https://v3.vuejs.org/guide/component-custom-events.html#v-model-arguments)
-