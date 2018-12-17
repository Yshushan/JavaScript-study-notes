# Vuex
## State
```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        count: 0
    }
})

const app = new Vue({
    el: '#app',
    store,
    //...
})
```

Vuex 使用[单一状态树](https://vuex.vuejs.org/guide/state.html#single-state-tree)，所有应用层级的状态都被包含在一个对象里。

在组件中导入 `state`:
```js
import {mapState} from 'vuex'

export default {
    data () {
        return {
            localCount: 1
        }
    },
    computed: {
        // 使用 $store 直接导入
        count () {
            return this.$store.state.count
        },

        // 使用 'mapState':
        ...mapState([
            'count' // this.count => this.$store.state.count
        ]),

        // 或者指定不同的名字：
        ...mapState({
            // 指定别名：this.countAlias => this.$store.state.count
            countAlias: 'count', 

            //要使用本地状态，必须使用常规函数（接受 state 作为参数），否者无法访问 this
            // this.countPlusLocalState => this.$store.state.count + this.localCount
            countPlusLocalState: function (state) {
                return state.count + this.localCount
            }
        })
    }
}
```
> 上面的代码只是作为示例，实际使用时根据实际需要选择一种方法即可。

Vuex stores 被设计成响应式的 (reactive)，当 `store` 
里的状态发生变化时，组件中对应的计算属性会重新计算，进而触发相关的 DOM 更新。

## Getters
同组件里的 `computed` 属性一样，可以在 Vuex 里定义 `getters`：
```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    // getters 接受 state 作为第一个参数
    doneTodos (state) {
      return state.todos.filter(todo => todo.done)
    },
    // 也接受 getters 作为第二参数，这样你可以调用其它 getter
    doneTodosCount (state, getters) {
        return getters.doneTodos.length
    },
    //让 getter 返回一个 function，甚至你可以像使用函数一样使用 getter
     doneTodoById (state) { // 像这样：store.getters.doneTodoById(2)
         return id => {
             return state.todos.find(todo => todo.id === id)
         }
     }
  }
})
```
在组件中导入 `getters`:
```js
import {mapGetters} from 'vuex'

export default {
    data () {
        return {
            localCount: 1
        }
    },
    computed: {
        // 使用 $store 直接导入
        doTodos () {
            return this.$store.getters.doTodos 
        },
        doneTodosCount () {
            return this.$store.getters.doneTodosCount
        },
        doneTodoById () { // 像使用函数一样，可以给这个计算属性传参：this.doneTodoById(2)
            return this.$store.getters.doneTodoById
        },

        // 使用 'mapGetters':
        ...mapGetters([
            'doTodos', // this.doTodos => this.$store.getters.doTodos
            'doneTodosCount', // this.doneTodosCount => this.$store.getters.doneTodosCount
            'doneTodoById' // this.doneTodoById(id) => this.$store.getters.doneTodoById(id)
        ]), 

        // 使用别名：
        ...mapGetters({
            doTodosAlias: 'doTodos', // this.doTodosAlias => this.$store.getters.doTodos
            doneTodosCountAlias: 'doneTodosCount', // this.doneTodosCountAlias => this.$store.getters.doneTodosCount
            doneTodoByIdAlias: 'doneTodoById' // this.doneTodoByIdAlias(id) => this.$store.getters.doneTodoById(id)
        })
    }
}
```
> 上面的代码只是作为示例，实际使用时根据实际需要选择一种方法即可。

## Mutations
更改 Vuex 中的状态的唯一方式就是 commit mutation。

Vuex 中的 mutations 的行为与 js 中的事件 (events) 很相似，mutation 的名字相当于事件类型，mutation 的 handler 相当于为事件注册的处理函数：
```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        // 这好比”事件注册“：当 increment 被 commit 时，调用它的 handler
        increment (stata) {
            state.count++
        }
    }
})
```
要更改状态不是直接调用 mutation 的 handler：
```js
// 你不能这样做！！！
store.mutations.increment()
```
而是通过 `store` 的 `commit` 方法来提交 matation 的名字：
```js
// 这更像是“事件触发”
store.commit('increment')
```
`mutation` 以 `state` 做为它的 handler 的第一个参数，但是你也可以给它提供一个额外的参数作为 payload:
```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        incrementBy (stata, n) {
            state.count += n
        }
    }
})

store.commit('incrementBy', 10)
```
大多数情况下，payload 应该是一个对象，这样你就可以提供多个字段信息：
```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        incrementBy (stata, payload) {
            state.count += payload.amount
        }
    }
})

store.commit('incrementBy', {
    amount: 10
})
```
支持对象风格的 commit，整个对象将作为 payload 传递给 mutation 的 handler：
```js
store.commit({
    type: 'incrementBy',
    amount: 10
})
```
### 在组件中 Commit Mutation

```js
import {mapMutations} from 'vuex'

export default {
    methods: {
        // 使用 $store.commit：
        increment () {
            this.$store.commit('increment')
        },
        incrementBy (payload) {
            this.$store.commit('incrementBy', payload)
        },

        // 使用 'mapMutations':
        ...mapMutations([
            'increment', // this.increment() => this.$store.commit('increment')
            'incrementBy' // this.incrementBy(payload) => this.$store.commit('incrementBy', payload)
        ]), 

        // 使用别名：
        ...mapMutations({
            add: 'increment', // this.add() => this.$store.commit('increment')
            addBy: 'incrementBy' // this.addBy(payload) => this.$store.commit('incrementBy', payload)
        })
    }
}
```
> 上面的代码只是作为示例，实际使用时根据实际需要选择一种方法即可。
### mutation 内的操作必须是同步的
所有的 `store.commit` 涉及的操作必须在当前时刻完成，详细请看[这里](https://vuex.vuejs.org/guide/mutations.html#mutations-must-be-synchronous)。

## Actions
Actions 与 mutations 有点相似，但是它们有两个重要的区别：
+ 在 action 里不直接更改状态，而是通过 commit mutation
+ 在 action 中可以进行任意的异步操作

注册 action ：
```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (stata) {
            state.count++
        }
    },
    actions: {
        incrementAction (context) {
            context.commit('increment')
        }
    }
})
```
action handler 接受一个 `context` 对象作为参数，这个对象暴露了与 store 实例相同的一些方法和属性，例如：`commit`, `state`, `getters` 等等。利用对象解构语法，action handler 可以这样简化：
```js
const store = new Vuex.Store({
    state: {
        count: 0,
        payload: 10
    },

    mutations: {
        incrementBy (stata, payload) {
            state.count += payload
        }
    },
    actions: {
        // 使用对象参数解构语法：
        incrementByAction ({commit, state}) {
            commit('incrementBy', state.payload)
        },

        // action handler 接受第二个参数作为 payload
        // action handler 内可以执行异步操作
        incrementByActionAsync({commit}, payload){
            setTimeout(() => {
                commit('incrementBy', payload)
            }, 1000)
        }

    }   
})
```
触发 action：
```js
store.dispatch('incrementByAction')
store.dispatch('incrementByActionAsync', 10)
```
同触发 mutation 类似，你不能直接调用 action 的 handler，而是通过调用 `store` 的 `dispatch` 方法来触发。

### 在组件中 Dispatch Action
```js
import {mapActions} from 'vuex'

export default {
    methods: {
        // 使用 $store.dispatch：
        incrementAction () {
            this.$store.dispatch('incrementAction')
        },
        incrementByActionAsync (payload) {
            this.$store.dispatch('incrementByActionAsync', payload)
        },

        // 使用 'mapActions':
        ...mapActions([
            'incrementAction', // this.incrementAction() => this.$store.dispatch('incrementAction')
            'incrementByActionAsync' // this.incrementByActionAsync(payload) => this.$store.dispatch('incrementByActionAsync', payload)
        ]),

        // 使用别名：
        ...mapActions({
            addAction: 'incrementAction', // this.addAction() => this.$store.dispatch('incrementAction')
            addByActionAsync: 'incrementByActionAsync' // this.addByActionAsync(payload) => this.$store.dispatch('incrementByActionAsync', payload)
        })
    }
}
```
> 上面的代码只是作为示例，实际使用时根据实际需要选择一种方法即可。

### 组合 Actions
Actions 一般都用于异步操作，`store.dispatch` 可以处理 action handler 返回的 Promise，同时它也返回一个 Promise：
```js
actions: {
  actionA ({commit}) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('someMutation')
        resolve()
      }, 1000)
    })
  }
}
```
然后你可以：
```js
store.dispatch('actionA').then(() => {
  // ...
})
```
或者在另一个 action 中：
```js
actions：{
  // ...
  actionB ({dispatch, commit}) {
    return dispatch('actionA').then(() => {
      commit('someOtherMutation')
    })
  }
}
```
你也可以用 `async/await` 语法，来组合actions：
```js
// 假设 getData() 和 geOtherData() 返回 Promise

actions: {
  async actionA ({commit}) {
    commit('gotData', await getData())
  },
  async actionB ({dispatch, commit}) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await gotOtherData())
  }
}
```
更多请看[这里](https://vuex.vuejs.org/guide/actions.html)。

## 模块化

由于使用单一状态树 (single state tree)，应用里的所有共享状态都被包含在同一个对象中。随着我们应用规模变的越来越大，这个store 也会膨胀的很大，这可能不是好事，也难以维护。

Vuex 允许你将 store 分割成小的模块，每个模块包含自己 `state`, `getters`, `mutations`, `actions`:
```js
const moduleA = {
  state: { ... },
  getters: { ... },
  mutations: { ... },
  actions: { ... }
}

const moduleB = {
  state: { ... },
  getters: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    moduleA,
    moduleB
  }
})

store.state.moduleA // 访问 moduleA 的 state
store.state.moduleB // 访问 moduleB 的 state
```
### 模块的局部状态
模块内部的 `getters` 和 `mutations` 接收的第一个参数是模块局部 `state`, 模块内部的 `actions` 通过 `context.state` 暴露的也是局部 `state`：
```js
const moduleA = {
  state: { 
    count: 0
  },
  getters: {
    doubleCount (state) {
      // state 是 local state
      return state.count * 2
    },
  },
  mutations: {
    increment (state) {
      // state 是 local state
      state.count++
    }
  },
  actions: {
    incrementOnlyOdd ({ state, commit}) {
      // state 是 local state
      if(state.count % 2){
        commit('increment')
      }
    }
  }
}
```
如果要访问根 `state`，`getters` 接受根 `state` 作为第三个参数, 而 `actions` 通过 `context.rootState` 暴露根 `state`：
```js
const moduleA = {
  // ...
  getters: {
    // 注意，这里的第二个参数 getters 是全局的
    // 同过它能访问到模块内和根部的所有 getter，指定了 namespace 的模块除外
    sumWithRootCount(state, getters, rootState){
      return state.count + rootState.count
    }
  },
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
```
> **注意**
> + 不管模块指不指定 namespace，模块内的 `state` 都是局部的，且不会与同名的根 `state` 产生冲突。
> + 如果没有指定 namespace，模块内部的 `getters`, `mutations`, `actions` 都是注册到全局名称空间 (global namespace) 的，访问它们与访问根部的选项没有任何区别：
>   ```js
>    // 访问模块内 getters
>   store.getters.getterInModule
>   globalGetter(state, getters) { getters.getterInModule }
>
>   // commit 模块内 mutations
>   store.commit('mutationInModule')
>   globalAction({commit}) { commit('mutationInModule') }
>   
>   // dispatch 模块内 actions
>   store.dispatch('actionInModule')
>   globalAction({dispatch}) { dispatch('mutationInModule') }
>   ```
> + 如果没有指定 namespace，模块内的 getter 会与根部同名的 getter 产生冲突。但是 mutation 和 action 不会，同名的 mutaion 和 action 就好比给同一个事件注册了多个处理函数，当某个 mutation 或 action 被触发时，对应的所有 handler 会依次被调用。


### 指定名称空间 (Namespacing)
如果你想要模块更独立且能被重用，你可以为模块指定名称空间：`namespaced: true`。这样当模块被注册时，它内部的 `getters`, `actions`, `mutations` 将基于模块被注册的路径，被自动添加到名称空间中：
```js
const store = new Vuex.Store({
  modules: {
    account: {
      namespaced: true,

      // module assets
      state: { ... }, // 模块内 state 始终是局部的，不受 namespace 选项影响
      getters: {
        // 模块内 getter 不再与全局同名的 getter 冲突，且在模块外部必须通过名称空间来访问：
        // store.getters['account/isAdmin']
        // globalGetter(state, getters) { getters['account/isAdmin'] }
        isAdmin () { ... },

        // 第二参数 getters 将是局部的，通过它可以访问局部 getter 不需添加名称空间前缀
        // 第四个参数 rootGetters 是全局的，可以访问全局空间内的 getter
        otherGetter (state, getters, rootState, rootGetters) {
          getters.isAdmin // => account/isAdmin
          rootGetters.isAdmin // => isAdmin
        }
        
      },
      actions: {
        // 模块内 action 在模块外部必须通过名称空间来 dispatch:
        // store.dispatch('account/login')
        // globalAction({dispatch}) { dispatch('account/login') }
        login () { ... },

        otherAction ({commit, dispatch, state, getters, rootState, rootGetters}) {
          // commit 是局部的，默认 commit 模块内部的 mutation
          commit('innerMutation')
          // 要 commit 全局的 mutation，使用 {root: true} 作为第三个参数
          commit('globalMutation', payload, {root: true})

          // dispatch 是局部的，默认 dispatch 模块内部的 action
          dispatch('innerAction')
          // 要 dispatch 全局的 action，使用 {root: true} 作为第三个参数
          dispatch('globalAction', payload, {root: true})

          // getters 是局部的，通过它可以访问局部 getter 不需添加名称空间前缀
          getters.isAdmin // => account/isAdmin

          // rootGetters 是全局的，可以访问全局空间内的 getter
          rootGetters.isAdmin // => isAdmin
        }
      },
      mutations: {
        // 模块内 mutation 在模块外部必须通过名称空间来 commit
        // store.commit('account/login')
        // globalAction({commit}) { commit('account/login') }
        login () { ... } 
      },

      // nested modules
      modules: {
        // inherits the namespace from parent module
        myPage: {
          state: { ... },
          getters: {
            profile () { ... } // -> getters['account/profile']
          }
        },

        // further nest the namespace
        posts: {
          namespaced: true,

          state: { ... },
          getters: {
            popular () { ... } // -> getters['account/posts/popular']
          }
        }
      }
    }
  }
})
```
### 在组件中导入 Namespaced Module
```js
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  // ...
  computed: {
    // 导入 Module State
    // 使用 $store
    foo () {
      return this.$store.state.some.nested.module.foo
    },
    // 使用 mapState
    // 指定别名
    ...mapState({
      // module state 不支持 fooAlias: 'some/nested/module/foo' 这样的形式，必须像下面这样指定别名
      fooAlias: state => state.some.nested.module.foo
    }),
    // 更好的方式是传递 namespace 字符串给 mapState 作为第一个参数
    ...mapState('some/nested/module', [
      'foo', // this.a => this.$store.state.some.nested.module.foo
      'bar' // this.b => this.$store.state.some.nested.module.bar
    ]),
    ...mapState('some/nested/module', {
      fooAlias: 'foo' // this.aAlias => this.$store.state.some.nested.module.foo
    })

    // 导入 Module Getters
    // 使用 $store
    moduleGetter () {
      return this.$store.getters['some/nested/module/moduleGetter']
    },
    // 使用 mapGetters
    ...mapGetters([
      'some/nested/module/moduleGetter', // this['some/nested/module/moduleGetter'] => this.$store.getters['some/nested/module/moduleGetter']
      'someRootGetter'
    ]),
    // 指定别名
    ...mapGetters({
      getterAlias: 'some/nested/module/moduleGetter' // this.getterAlias => this.$store.getters['some/nested/module/moduleGetter']
    }),
    // 更好的方式是传递 namespace 字符串给 mapGetters 作为第一个参数
    ...mapGetters('some/nested/module', [
      'moduleGetter'
    ]),
    ...mapGetters('some/nested/module', {
      getterAlias: 'moduleGetter'
    })
  },

  methods: {
    // 导入 Module Mutations
    // 使用 $store
    moduleMutation () {
      this.$store.commit('some/nested/module/moduleMutation')
    },
    // 使用 mapMutations
    ...mapMutations([
      'some/nested/module/moduleMutation', // this['some/nested/module/moduleMutation']() => this.$store.commit('some/nested/module/moduleMutation')
      'someRootMutation'
    ]),
    // 指定别名
    ...mapMutations({
      mutationAlias: 'some/nested/module/moduleMutation' // this.mutationAlias() => this.$store.commit('some/nested/module/moduleMutation')
    }),
    // 更好的方式是传递 namespace 字符串给 mapMutations 作为第一个参数
    ...mapMutations('some/nested/module', [
      'moduleMutation' //this.moduleMutation() => this.$store.commit('some/nested/module/moduleMutation')
    ]),
    ...mapMutations('some/nested/module', {
      mutationAlias: 'moduleMutation'
    })

    // 导入 Module Actions
    // 使用 $store
    moduleAction () {
      this.$store.dispatch('some/nested/module/moduleAction')
    },
    // 使用 mapActions
    ...mapActions([
      'some/nested/module/moduleAction', // this['some/nested/module/moduleAction']() => this.$store.dispatch('some/nested/module/moduleAction')
      'someRootAction'
    ]),
    // 指定别名
    ...mapAction({
      actionAlias: 'some/nested/module/moduleAction' // this.actionAlias() => this.$store.dispatch('some/nested/module/moduleAction')
    }),
    // 更好的方式是传递 namespace 字符串给 mapActions 作为第一个参数
    ...mapAction('some/nested/module', [
      'moduleAction' // this.moduleAction() => this.$store.dispatch('some/nested/module/moduleAction')
    ]),
    ...mapActions('some/nested/module', {
      actionAlias: 'moduleAction'
    })
  }
}
```
更多用法请看[这里](https://vuex.vuejs.org/guide/modules.html#binding-helpers-with-namespace)。

## Plugins
Vuex stores 可以接受一个 `plugins` 选项来为每一次 mutation 定制钩子，Vuex plugin 是一个接受 `store` 作为唯一参数的函数。关于 plugins 的用法请看[这里](https://vuex.vuejs.org/guide/plugins.html#plugins)。

## 严格模式 (Strict Mode)
开启严格模式：
```js
const store = new Vuex.Store({
  // ...
  strict: true
})

```
在严格模式下， 所有的 state 变更必须通过 commit mutation 在 mutation handler 里面进行，否者将会抛出错误。

但是不要在生产环境下开启严格模式：
```js
const store = new Vuex.Store({
  // ...
  strict: process.env.NODE_ENV !== 'production'
})
```
## 表单处理
如果 `v-model` 指令绑定的数据是属于 Vuex store 的 state，当 Vuex 处于严格模式下时，这会有点问题:
```js
<input v-model="message">
```
如果 `message` 是从 Vuex store 中导入的 state 生成的计算属性，因为 `v-model` 双向绑定的特性，当用户在输入框中输入内容时，`v-model` 将试图直接去修改 `message` 的值，这将导致一个错误，因为在严格模式下，store state 的修改必须在 mutation handler 里进行。

要解决这个问题，一个方法是将 `v-model` 中更新数据的部分分离出来，来定制它的行为：
```html
// component.vue

<template>
  <input :value="message" @input="updateMessage">
</template>

<script>
export default {
  // ...
  computed: {
    message () {
      return this.$store.state.message
    }
  },
  methods: {
    updataMessage (e) {
      this.$store.commit('updateMessage', e.target.value)
    }
  }
}
</script>
```
最好的方法是使用计算属性的双向绑定：
```html
<template>
  <input v-model="message">
</template>

<script>
export default { 
  // ...
  computed: {
    message: {
      get () {
        return this.$store.state.message
      },
      set (value) {
        this.$store.commit('updateMessage', value)
      }
    }
  }
}
</script>
```
```js
// store.js

// ...
state: {
  message: ''
}
mutations: {
  updateMessage (state, message) {
    state.message = message
  }
}
```
更多关于 Vuex 看[这里](https://vuex.vuejs.org/)。