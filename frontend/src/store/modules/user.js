import moment from 'moment';
import userService from '@/services/userService';
import configService from '@/services/configService';

const state = {
  user: null,
  loading: false
};

const actions = {
  me({ dispatch, commit }, { router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    userService
      .me()
      .then(response => {
        commit('setUser', { user: response.data });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  updateMe({ dispatch, commit }, { user, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    userService
      .updateMe({
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        password: user.password
      })
      .then(response => {
        commit('setUser', { user: response.data });
        commit(
          'alert/setMessage',
          { type: 'success', message: 'Your information has been successfully updated.' },
          { root: true }
        );
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  }
};

const getters = {};

const mutations = {
  startRequest(state) {
    state.loading = true;
  },
  requestFailed(state) {
    state.loading = false;
  },
  setUser(state, { user }) {
    state.loading = false;
    state.user = user;

    if (moment(state.user.last_login_at).isValid()) {
      state.user.last_login_at_formatted = moment(state.user.last_login_at).format(
        configService.get('format').dateTime
      );
    } else {
      state.user.last_login_at_formatted = 'Never logged in';
    }

    if (state.user.first_name && state.user.last_name) {
      state.user.full_name = `${state.user.first_name}, ${state.user.last_name}`;
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
