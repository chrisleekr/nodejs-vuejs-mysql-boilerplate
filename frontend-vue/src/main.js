import Vue from 'vue';
import VueMeta from 'vue-meta';
import Vuelidate from 'vuelidate';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueSweetalert2 from 'vue-sweetalert2';
import '@sweetalert2/theme-dark/dark.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPlus, faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import App from './App.vue';
import router from './router';
import store from './store';
import setupInterceptors from './services/setupInterceptors';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
});
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2, {});

library.add(faTrash, faPlus, faCheckSquare, faSquare);
Vue.component('font-awesome-icon', FontAwesomeIcon);

setupInterceptors(store);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
