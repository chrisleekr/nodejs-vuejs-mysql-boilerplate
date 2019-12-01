import _ from 'lodash';
import axios from 'axios';
import configService from '@/services/configService';
import utils from '@/helper/utils';

export default {
  async list({ type = 'user', query = {} } = {}) {
    const pickedQuery = _.pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('apiHost')}/${type}`;
    if (pickedQuery.length) {
      url += `?${utils.toQueryStrings(pickedQuery)}`;
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

  async getOne({ type = 'user', userId }) {
    return axios
      .get(`${configService.get('apiHost')}/${type}/${userId}`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOne({ type = 'user', user } = {}) {
    return axios
      .post(`${configService.get('apiHost')}/${type}`, user)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async patchOne({ type = 'user', userId, newUser }) {
    return axios
      .patch(`${configService.get('apiHost')}/${type}/${userId}`, newUser)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async deleteOne({ type = 'user', userId }) {
    return axios
      .delete(`${configService.get('apiHost')}/${type}/${userId}`)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};
