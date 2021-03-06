// Vuex 容器： 集中式状态(数据) 管理
// 这里的数据和组件无关
// 任何组件都可以:
// 读取
// 在任何组件中都可以通过 this.$store.state.xxx 来访问容器中的数据
// state 中的数据也是响应式的，数据改变也会驱动视图更新
// 修改
// 不要直接在组建中 this.$store.state.xxx = xxx 修改容器数据
// 正确的修改方式是：
// 1，在容器中定义 mutation 函数修改 state 状态
// 2，在组建中提交 mutation 完成对状态的修改
// 不要在组建中修改 state 数据，而是在容器中修改 state 数据
// 1,npm i vuex
// 2,配置

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 3,创建容器

const store = new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user_Info'))
  },
  // mutation 类似于组建中的 methods
  // 记住一个原则，修改 state 永远通过 mutation 函数修改，不要再组件中去 this.$store.state.xxx = xxx
  // 函数自己定义，函数默认接收一个参数 state，也就是容器中的 state
  // 我们可以在 mutation 函数中去 state.xxx = xxx
  mutations: {
    changeUser (state, data) {
      // console.log('changeUser' ,data)
      Object.assign(state.user, data)
      window.localStorage.setItem('user_Info', JSON.stringify(state.user))
    }
    // user: JSON.parse(window.localStorage.getItem('user_info'))
  }
})

// 4，导出容器对象、

export default store
