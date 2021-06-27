import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/login.vue'

import Home from 'views/home.vue';
import Welcome from './views/welcome.vue';
import User from './views/user/userList.vue';
import Rights from './views/rights/rights.vue';
import Roles from './views/roles/roles.vue'

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
    component: Home,
    children: [
      {
        path: '/',
        redirect: '/welcome'
      },
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
    ]
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