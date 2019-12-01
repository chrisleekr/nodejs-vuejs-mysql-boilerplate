import permissionService from '@/services/permissionService';

const state = {
  permissions: null,
  loading: false
};

const actions = {
  list({ dispatch, commit }, { router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    permissionService
      .list({ router })
      .then(response => {
        commit('setPermissions', { permissions: response.data });
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
  setPermissions(state, { permissions }) {
    state.loading = false;
    state.permissions = permissions;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
