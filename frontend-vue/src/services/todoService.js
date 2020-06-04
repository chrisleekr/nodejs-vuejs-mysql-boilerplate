import axios from 'axios';
import configService from '@/services/configService';

export default {
  async list({ state = undefined } = {}) {
    let url = `${configService.get('apiUrl')}/todo`;
    if (state) {
      url += `/${state}`;
    }

    return axios
      .get(url, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOne({ todo }) {
    return axios
      .post(`${configService.get('apiUrl')}/todo`, todo)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postBulk({ state, todoList }) {
    return axios
      .post(`${configService.get('apiUrl')}/todo/${state}`, {
        todo: todoList
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async deleteOne({ todoId }) {
    return axios
      .delete(`${configService.get('apiUrl')}/todo/${todoId}`)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};
