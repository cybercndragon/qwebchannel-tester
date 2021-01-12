import Vue from 'vue'
import Buefy from 'buefy'
import VueHighlightJS from 'vue-highlightjs'

import './assets/main.scss'
import '@mdi/font/css/materialdesignicons.min.css'
//import 'highlight.js/styles/googlecode.css'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import App from './App.vue'

Vue.use(Buefy)
Vue.use(VueHighlightJS)

Vue.config.productionTip = false
// 声明一个全局的业务总线
Vue.prototype.$eventBus = new Vue()

new Vue({
  render: (h) => h(App),
}).$mount('#app')
