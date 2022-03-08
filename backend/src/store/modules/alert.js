import Vue from 'vue';

const state = {
  type: null,
  position: null,
  title: null,
  text: null
};

const actions = {
  success({ commit }, { showType, position, title, text }) {
    commit('success', { showType, position, title, text });
  },
  info({ commit }, { showType, position, title, text }) {
    commit('info', { showType, position, title, text });
  },
  error({ commit }, { showType, position, title, text }) {
    commit('error', { showType, position, title, text });
  },
  setMessage({ commit }, { type, message }) {
    commit('setMessage', { type, message });
  },
  clear({ commit }) {
    commit('clear');
  }
};

const getters = {
  errorMessages: state => {
    if (state.type === 'error' && state.text !== '') {
      return state.text;
    }
    return '';
  },
  successMessages: state => {
    if (state.type === 'success' && state.text !== '') {
      return state.text;
    }
    return '';
  }
};

const displayToast = ({ type, position, title, text }) => {
  Vue.swal({
    toast: true,
    position,
    showConfirmButton: false,
    timer: 10000,
    type,
    title,
    text
  });
};

const mutations = {
  success(state, { showType, position, title, text }) {
    state.type = 'success';
    state.position = position || 'bottom-end';
    state.title = title;
    state.text = text;
    if (showType === 'toast') {
      displayToast({ type: state.type, position: state.position, title: state.title, text: state.text });
    }
  },
  info(state, { showType, position, title, text }) {
    state.type = 'info';
    state.position = position || 'bottom-end';
    state.title = title;
    state.text = text;
    if (showType === 'toast') {
      displayToast({ type: state.type, position: state.position, title: state.title, text: state.text });
    }
  },
  error(state, { showType, position, title, text }) {
    state.type = 'error';
    state.position = position || 'bottom-end';
    state.title = title;
    state.text = text;
    if (showType === 'toast') {
      displayToast({ type: state.type, position: state.position, title: state.title, text: state.text });
    }
  },
  clear(state) {
    state.type = null;
    state.position = null;
    state.title = null;
    state.text = null;
  },
  setMessage(state, { type, message }) {
    state.type = type;
    state.text = message;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
