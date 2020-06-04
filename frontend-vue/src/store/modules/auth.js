import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';
import jwtDecode from 'jwt-decode';

import authService from '@/services/authService';

const state = {
  authKey: localStorage.getItem('auth-key') || '',
  loading: false,
  isRegistered: false,
  isLoggedIn: false,
  isPasswordResetRequested: false,
  isPasswordResetted: false,
  user: localStorage.getItem('auth-key') ? jwtDecode(localStorage.getItem('auth-key')) : null
};

const actions = {
  passwordReset({ dispatch, commit }, { key, password, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    authService
      .passwordReset({ key, password })
      .then(response => {
        commit('passwordResetSuccess', {});
        dispatch('alert/success', { showType: 'toast', title: response.message }, { root: true });
      })
      .catch(e => {
        commit('passwordResetFailure');

        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },

  passwordResetRequest({ dispatch, commit }, { email, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    authService
      .passwordResetRequest({ email })
      .then(response => {
        commit('passwordResetRequestSuccess', {});
        dispatch('alert/success', { showType: 'toast', title: response.message }, { root: true });
      })
      .catch(e => {
        commit('passwordResetRequestFailure');

        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  register({ dispatch, commit }, { username, email, password, firstName, lastName, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    authService
      .register({ username, email, password, firstName, lastName })
      .then(response => {
        commit('registerSuccess', {});
        dispatch('alert/success', { showType: 'toast', title: response.message }, { root: true });
      })
      .catch(e => {
        commit('registerFailure');

        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
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
  logout({ dispatch, commit }, { router, slient = false }) {
    dispatch('alert/clear', {}, { root: true });
    commit('logout');

    if (!slient) {
      dispatch('alert/success', { showType: 'toast', title: 'You are successfully logged out.' }, { root: true });

      router.push('/');
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
  handleAuthMessageKey({ dispatch }, { messageKey }) {
    switch (messageKey) {
      case 'registerConfirmSuccess':
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            title: 'Success',
            text: 'You are now verified. Please use your username/password to login.'
          },
          { root: true }
        );
        break;
      case 'registerConfirmFailed':
        dispatch(
          'alert/error',
          {
            showType: 'toast',
            title: 'Failed',
            text: 'Sorry, we cannot verify your email. Please try again.'
          },
          { root: true }
        );
        break;
      case 'registerConfirmValidationError':
        dispatch(
          'alert/error',
          {
            showType: 'toast',
            title: 'Failed',
            text: 'The token is expired or not valid. Please try again.'
          },
          { root: true }
        );
        break;
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
    state.isRegistered = false;
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
  registerSuccess(state) {
    state.loading = false;
    state.isRegistered = true;
  },
  registerFailure(state) {
    state.loading = false;
    state.isRegistered = false;
  },
  passwordResetRequestSuccess(state) {
    state.loading = false;
    state.isPasswordResetRequested = true;
  },
  passwordResetRequestFailure(state) {
    state.loading = false;
    state.isPasswordResetRequested = false;
  },
  passwordResetSuccess(state) {
    state.loading = false;
    state.isPasswordResetted = true;
  },
  passwordResetFailure(state) {
    state.loading = false;
    state.isPasswordResetted = false;
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
    state.isRegistered = false;
    state.isLoggedIn = false;
    state.isPasswordResetRequested = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
