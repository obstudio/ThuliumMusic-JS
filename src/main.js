import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import Loader from './reg'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Loader)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
