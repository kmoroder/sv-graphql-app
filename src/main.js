import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import { createProvider } from './vue-apollo'

Vue.prototype.$http = axios;

new Vue({
  apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");
