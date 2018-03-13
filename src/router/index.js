import Vue from 'vue'
import Router from 'vue-router'
import TmEditor from '@/components/TmEditor'
import TmDoc from '@/components/TmDoc'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HelloWorld
    },
    {
      path: '/editor',
      name: 'TmEditor',
      component: TmEditor,
      props: {
        width: '100%',
        height: '100%'
      }
    },
    {
      path: '/doc/:doc?',
      name: 'TmDocument',
      component: TmDoc
    }
  ]
})
