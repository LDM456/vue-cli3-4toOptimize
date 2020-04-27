import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import service from './api/axios'

Vue.prototype.$service = service;   // 2、在vue中使用axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
