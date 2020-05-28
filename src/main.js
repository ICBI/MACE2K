import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import VueNeo4j from 'vue-neo4j'

Vue.config.productionTip = false
Vue.use(VueNeo4j);

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
