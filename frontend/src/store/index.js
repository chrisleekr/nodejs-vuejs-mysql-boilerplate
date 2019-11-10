import Vue from 'vue';
import Vuex from 'vuex';

import common from './modules/common';
import auth from './modules/auth';
import alert from './modules/alert';
import user from './modules/user';
import todo from './modules/todo';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    auth,
    alert,
    user,
    todo
  },
  strict: true
});
