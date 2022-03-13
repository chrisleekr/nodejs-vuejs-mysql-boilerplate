import _ from 'lodash';

const state = {};

const actions = {
  handleServiceException({ dispatch, commit }, { e, router = null }) {
    if (e.response) {
      const { data, status } = e.response.data;

      let errorMessages = [];
      if (status === 422) {
        errorMessages = _.reduce(
          data,
          (errorMessages, tmpData) => {
            errorMessages.push(tmpData.msg);
            return errorMessages;
          },
          []
        );

        commit('alert/setMessage', { type: 'error', message: _.join(errorMessages, '\r\n') }, { root: true });
      } else if (status === 403) {
        dispatch('auth/sessionExpired', { router }, { root: true });
      }
    } else {
      dispatch('alert/error', { showType: 'toast', title: 'Error', text: e.message }, { root: true });
      throw new Error(e);
    }
  }
};

const getters = {};

const mutations = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
