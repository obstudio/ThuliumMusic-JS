import Vue from 'vue'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import Icon from 'vue-awesome/components/Icon'
import App from './App'
import router from './router'
import extendVue from './TmVueExt'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'vue-awesome/icons'

Vue.use(VueI18n)
Vue.use(ElementUI)
extendVue(Vue)
Vue.component('icon', Icon)
Vue.config.productionTip = false

/* self.MonacoEnvironment = {
  getWorkerUrl (moduleId, label) {
    return './static/js/editor.worker.js'
  }
} */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
