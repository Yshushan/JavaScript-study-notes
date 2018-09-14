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
            return this.$store.count
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
const store = new new Vuex.Store({
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
// 这更像是”事件触发“
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
### 在组件中 commit mutation

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
            '', // this.doTodos => this.$store.getters.doTodos
            'increment', // this.increment() => this.$store.commit('increment')
            'incrementBy' // this.incrementBy(payload) => this.$store.commit('incrementBy', payload)
        ]), 

        // 使用别名：
        ...mapMutations({
            add: 'increment', // this.add() => this.$store.commit('increment')
            addBy: 'incrementBy' // this.addBy(payload) => this.$store.commit('increment', payload)
        })
    }
}
```
> 上面的代码只是作为示例，实际使用时根据实际需要选择一种方法即可。
### mutation 内的操作必须是同步的
所有的 `store.commit` 涉及的操作必须在当前时刻完成，详细请看[这里](https://vuex.vuejs.org/guide/mutations.html#mutations-must-be-synchronous)。

## Actions
Actions 与 mutations 有点相似，但是它们有两个重要的区别：
+ 在 action 里不直接更改状态，而是 commit mutation
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

## 在组件中 Dispatch Action
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

