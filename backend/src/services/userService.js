import _ from 'lodash';
import configService from '@/services/configService';
import utils from '@/helper/utils';
import api from './api';

export default {
  async list({ type = 'user', query = {} } = {}) {
    const pickedQuery = _.pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('apiUrl')}/${type}`;
    if (pickedQuery.length) {
      url += `?${utils.toQueryStrings(pickedQuery)}`;
    }

    return api.get(url, {}).then(response => response.data);
  },

  async getOne({ type = 'user', userId }) {
    return api.get(`${configService.get('apiUrl')}/${type}/${userId}`, {}).then(response => response.data);
  },

  async postOne({ type = 'user', user } = {}) {
    return api.post(`${configService.get('apiUrl')}/${type}`, user).then(response => response.data);
  },

  async patchOne({ type = 'user', userId, newUser }) {
    return api.patch(`${configService.get('apiUrl')}/${type}/${userId}`, newUser).then(response => response.data);
  },

  async deleteOne({ type = 'user', userId }) {
    return api.delete(`${configService.get('apiUrl')}/${type}/${userId}`).then(response => response.data);
  }
};
