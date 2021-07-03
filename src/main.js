import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

//引入重置css
import './assets/css/reset.css'
import './assets/css/base.css'

//引入iconfont
import 'assets/iconfont/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'
import moment from 'moment'; 
import 'quill/dist/quill.core'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.component('vue-tree', ZkTable)
Vue.use(VueQuillEditor)

import { Button, Input, Form, FormItem, Message,
Container, Header, Aside, Main, Menu, Submenu, MenuItem,
MenuItemGroup, Breadcrumb, BreadcrumbItem, Card,
Row, Col, Table, TableColumn, Switch, Tooltip, Pagination,
Dialog, MessageBox, Tag, Tree, Select, Option, Cascader, Alert,
Tabs, TabPane, Steps, Step, CheckboxGroup, Checkbox, Upload} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)

Vue.prototype.$message = Message
Vue.prototype.$messageBox = MessageBox

// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'

axios.interceptors.request.use( config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.filter('dateFormat', function(value){
  return moment(value).format("YYYY-MM-DD HH:mm:ss ");
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
