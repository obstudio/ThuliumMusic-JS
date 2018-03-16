import Vue from 'vue'
import ElementUI from 'element-ui'
import Icon from 'vue-awesome/components/Icon'
import Loader from './reg'
import Markdown from './Markdown'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'vue-awesome/icons/flag'
import 'vue-awesome/icons'

Vue.use(ElementUI)
Vue.component('icon', Icon)
Vue.use(Loader)
Vue.use(Markdown)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
