import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'
import './plugins/zkTable'

import '@/assets/styles/normalize.css'
import '@/assets/styles/base.css'

import '@/utils/request'

import '@/permission'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
