import configService from '@/services/configService';
import api from './api';

export default {
  async list({ state = undefined } = {}) {
    let url = `${configService.get('apiUrl')}/todo`;
    if (state) {
      url += `/${state}`;
    }

    return api.get(url, {}).then(response => response.data);
  },

  async postOne({ todo }) {
    return api.post(`${configService.get('apiUrl')}/todo`, todo).then(response => response.data);
  },

  async postBulk({ state, todoList }) {
    return api
      .post(`${configService.get('apiUrl')}/todo/${state}`, {
        todo: todoList
      })
      .then(response => response.data);
  },

  async deleteOne({ todoId }) {
    return api.delete(`${configService.get('apiUrl')}/todo/${todoId}`).then(response => response.data);
  }
};
