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
  },
  updateBulk({ dispatch, commit }, { state, todoList, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    todoService
      .postBulk({
        state,
        todoList
      })
      .then(_response => {
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Change has been saved.'
          },
          { root: true }
        );
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  addOne({ dispatch, commit }, { todo, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    todoService
      .postOne({ todo })
      .then(_response => {
        dispatch('list', { router });
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'New todo has been added.'
          },
          { root: true }
        );
      })
      .catch(e => {
        commit('requestFailed');
        dispatch('common/handleServiceException', { e, router }, { root: true });
      });
  },
  deleteOne({ dispatch, commit }, { todoId, router }) {
    dispatch('alert/clear', {}, { root: true });
    commit('startRequest');

    todoService
      .deleteOne({ todoId })
      .then(_response => {
        dispatch('list', { router });
        dispatch(
          'alert/success',
          {
            showType: 'toast',
            position: 'bottom-end',
            title: '',
            text: 'Todo has been deleted.'
          },
          { root: true }
        );
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
  },
  setIsDragging(state, { isDragging }) {
    state.isDragging = isDragging;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
