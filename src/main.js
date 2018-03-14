import Vue from 'vue'
import App from './App'
import router from './router'
import Loader from './reg'
import Markdown from './Markdown'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(Loader)
Vue.use(Markdown)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
