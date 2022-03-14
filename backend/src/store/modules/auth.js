import _ from 'lodash';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

import authService from '@/services/authService';

const state = {
  authKey: localStorage.getItem('backend-auth-key') || '',
  refreshAuthKey: localStorage.getItem('backend-refresh-auth-key') || '',
  loading: false,
  isLoggedIn: false,
  user: localStorage.getItem('backend-auth-key') ? jwtDecode(localStorage.getItem('backend-auth-key')) : null
};

const actions = {
  login({ dispatch, commit }, { username, password, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    authService
      .login(username, password)
      .then(response => {
        const { auth_key: authKey, refresh_auth_key: refreshAuthKey } = response.data;

        commit('loginSuccess', { authKey, refreshAuthKey });

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
      { showType: 'toast', title: 'Session expired', text: 'Your session has been expired. Please login again.' },
      { root: true }
    );

    router.push('/login');
  },
  handleAuthMessageKey(_store, { messageKey }) {
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

    // Check auth key
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
      return true;
    }

    // Check refresh auth key
    if (_.isEmpty(state.refreshAuthKey)) {
      return false;
    }

    try {
      decoded = jwtDecode(state.refreshAuthKey);
    } catch (e) {
      return false;
    }

    if (decoded.exp && moment.unix(decoded.exp).isAfter()) {
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
  loginSuccess(state, { authKey, refreshAuthKey }) {
    state.loading = false;
    state.isLoggedIn = true;
    state.authKey = authKey;
    state.user = jwtDecode(authKey);
    localStorage.setItem('backend-auth-key', authKey);
    localStorage.setItem('backend-refresh-auth-key', refreshAuthKey);
  },
  loginFailure(state) {
    state.loading = false;
  },
  logout(state) {
    state.isLoggedIn = false;
    state.authKey = null;
    state.user = null;
    localStorage.removeItem('backend-auth-key');
    localStorage.removeItem('backend-refresh-auth-key');
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
