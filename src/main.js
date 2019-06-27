import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import 'nprogress/nprogress.css'
import './style/index.less'
import axios from 'axios'

// axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// Axios 请求拦截器
// 所有使用 axios 发起的请求都要从这里经过
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_Info'))
  // console.log('有请求经过')
  // return config 就是允许通过的方式
  // config 是本次请求相关的配置对象
  // console.log(config)
  if (userInfo) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// Axios 响应拦截器
// 统一处理响应的数据格式
axios.interceptors.response.use(response => {
  return response.data.data
}, error => { // >= 400 的状态码会进入这里
  const status = error.response.status
  if (status === 401) {
    // 务必删除本地存储中的用户信息数据
    window.localStorage.removeItem('user_Info')
    // 跳转回登录页面
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})

Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
