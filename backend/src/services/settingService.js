import _ from 'lodash';
import axios from 'axios';
import configService from '@/services/configService';
import utils from '@/helper/utils';

export default {
  async list({ query = {} } = {}) {
    const pickedQuery = _.pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('apiUrl')}/setting`;
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

  async getOne({ settingId }) {
    return axios
      .get(`${configService.get('apiUrl')}/setting/${settingId}`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async postOne({ setting } = {}) {
    return axios
      .post(`${configService.get('apiUrl')}/setting`, setting)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async patchOne({ settingId, newSetting }) {
    return axios
      .patch(`${configService.get('apiUrl')}/setting/${settingId}`, newSetting)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async deleteOne({ settingId }) {
    return axios
      .delete(`${configService.get('apiUrl')}/setting/${settingId}`)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};
