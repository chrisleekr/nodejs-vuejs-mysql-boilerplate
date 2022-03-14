import Vue from 'vue';
import VueMeta from 'vue-meta';
import Vuelidate from 'vuelidate';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueSweetalert2 from 'vue-sweetalert2';
import '@sweetalert2/theme-bootstrap-4/bootstrap-4.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faPortrait,
  faTrash,
  faPlus,
  faCheckSquare,
  faSquare,
  faUser,
  faTachometerAlt,
  faCog,
  faUserCircle,
  faSignOutAlt,
  faEdit,
  faTrashAlt,
  faLongArrowAltLeft,
  faSave,
  faListAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css';
import ConfigService from '@/services/configService';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import SimpleLayout from './views/Layout/SimpleLayout.vue';
import BackendLayout from './views/Layout/BackendLayout.vue';

import setupInterceptors from './services/setupInterceptors';

Vue.config.productionTip = false;

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
});
Vue.use(Vuelidate);
Vue.use(BootstrapVue);
Vue.use(VueSweetalert2, {});
Vue.component('datetime', Datetime);

library.add(
  faPortrait,
  faTrash,
  faTrashAlt,
  faPlus,
  faCheckSquare,
  faSquare,
  faUser,
  faTachometerAlt,
  faCog,
  faUserCircle,
  faSignOutAlt,
  faEdit,
  faLongArrowAltLeft,
  faSave,
  faListAlt
);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('simple-layout', SimpleLayout);
Vue.component('backend-layout', BackendLayout);

ConfigService.loadConfig().then(() => {
  setupInterceptors(store);

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
});
