import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.prototype.$store = store
Vue.prototype.$arm = store.state.arm

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
