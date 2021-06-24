import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'

//引入重置css
import './assets/css/reset.css'
import './assets/css/base.css'

//引入iconfont
import 'assets/iconfont/iconfont.css'

import {Button, Input, Form, FormItem, Message} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)

Vue.prototype.$message = Message

axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

Vue.prototype.$http = axios



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
