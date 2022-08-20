import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { storePlugin } from './plugins/store-plugin'

Vue.config.productionTip = false
Vue.use(storePlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
