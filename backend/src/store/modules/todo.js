import _ from 'lodash';
import todoService from '@/services/todoService';

const state = {
  todo: null,
  pagination: null,
  loading: false,
  isDragging: false
};

const actions = {
  list({ dispatch, commit }, { state = undefined, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    todoService
      .list({ state })
      .then(response => {
        commit('setTodo', { todo: response.data.rows, pagination: response.data.pagination });
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  }
};

const getters = {
  pendingTodoList: state => _.filter(state.todo, todo => todo.state === 'pending'),
  ongoingTodoList: state => _.filter(state.todo, todo => todo.state === 'ongoing'),
  completedTodoList: state => _.filter(state.todo, todo => todo.state === 'completed'),
  archivedTodoList: state => _.filter(state.todo, todo => todo.state === 'archived')
};

const mutations = {
  startRequest(state) {
    state.loading = true;
  },
  requestFailed(state) {
    state.loading = false;
  },
  setTodo(state, { todo, pagination }) {
    state.loading = false;
    state.todo = todo;
    state.pagination = pagination;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
