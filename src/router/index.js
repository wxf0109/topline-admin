import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    // {
    //   name: 'home',
    //   path: '/',
    //   component: () => import('@/views/home')
    // },
    {
      name: 'home',
      path: '/',
      component: () => import('@/views/layout'),
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userInfo = window.localStorage.getItem('user_Info')
  // 如果是非 /login 页面， 判断其登录状态
  if (to.path !== '/login') {
    // 如果没有登录，就跳转回登录页面
    if (!userInfo) {
      next({ name: 'login' })
    } else {
      // 如果登录了，则允许通过
      next()
    }
  } else {
    // 如果登录了，就不能访问登录页面
    if (userInfo) {
      next(false)
    } else {
      // 没有登录，才能访问登录页
      next()
    }
  }
})

export default router
