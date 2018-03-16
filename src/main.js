import Vue from 'vue'
import ElementUI from 'element-ui'
import Icon from 'vue-awesome/components/Icon'
import Markdown from './Markdown'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import 'vue-awesome/icons'

Vue.use(ElementUI)
Vue.use(Markdown)
Vue.component('icon', Icon)
Vue.config.productionTip = false

self.MonacoEnvironment = {
  getWorkerUrl (moduleId, label) {
    return './editor.worker.js'
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
