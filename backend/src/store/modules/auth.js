import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

import authService from '@/services/authService';

const state = {
  authKey: localStorage.getItem('auth-key') || '',
  loading: false,
  isLoggedIn: false,
  user: localStorage.getItem('auth-key') ? jwtDecode(localStorage.getItem('auth-key')) : null
};

const actions = {
  login({ dispatch, commit }, { username, password, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    authService
      .login(username, password)
      .then(response => {
        commit('loginSuccess', { authKey: response.data.auth_key });
        dispatch('alert/success', { showType: 'toast', title: response.message }, { root: true });
        router.push('/');
      })
      .catch(e => {
        commit('loginFailure');

        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  logout({ dispatch, commit }, { router, silent = false }) {
    dispatch('alert/clear', {}, { root: true });
    commit('logout');

    if (!silent) {
      dispatch('alert/success', { showType: 'toast', title: 'You are successfully logged out.' }, { root: true });

      // https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
      router.push('/').catch(_e => {});
    }
  },
  sessionExpired({ dispatch, commit }, { router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('logout');

    dispatch(
      'alert/error',
      { showType: 'toast', title: 'Session expired', text: 'Please login with your account.' },
      { root: true }
    );

    router.push('/login');
  },
  handleAuthMessageKey({ _dispatch }, { messageKey }) {
    switch (messageKey) {
      default:
        break;
    }
  }
};

const getters = {
  isLoggedIn: state => () => {
    if (state.isLoggedIn) {
      return true;
    }

    if (_.isEmpty(state.authKey)) {
      return false;
    }

    let decoded = null;
    try {
      decoded = jwtDecode(state.authKey);
    } catch (e) {
      return false;
    }

    if (decoded.exp && moment.unix(decoded.exp).isAfter()) {
      axios.defaults.headers.common.Authorization = state.authKey;
      return true;
    }

    return false;
  }
};

const mutations = {
  startRequest(state) {
    state.loading = true;
    state.isLoggedIn = false;
  },
  loginSuccess(state, { authKey }) {
    state.loading = false;
    state.isLoggedIn = true;
    state.authKey = authKey;
    state.user = jwtDecode(authKey);
    localStorage.setItem('auth-key', authKey);
    axios.defaults.headers.common.Authorization = authKey;
  },
  loginFailure(state) {
    state.loading = false;
  },
  logout(state) {
    state.isLoggedIn = false;
    state.authKey = null;
    state.user = null;
    localStorage.removeItem('auth-key');
    axios.defaults.headers.common.Authorization = null;
  },
  clear(state) {
    state.loading = false;
    state.isLoggedIn = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
