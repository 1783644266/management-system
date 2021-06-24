import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'

import Home from 'views/home.vue';

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  ]
})

router.beforeEach((to, from, next) => {
  const tokener = window.sessionStorage.getItem('token')
  if (to.name !== 'login' && !tokener) {
    Vue.prototype.$message.error('请登录')
    return next('/login')
  }
  next()
})

export default router