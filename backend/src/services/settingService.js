import _ from 'lodash';
import configService from '@/services/configService';
import utils from '@/helper/utils';
import api from './api';

export default {
  async list({ query = {} } = {}) {
    const pickedQuery = _.pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('apiUrl')}/setting`;
    if (pickedQuery.length) {
      url += `?${utils.toQueryStrings(pickedQuery)}`;
    }

    return api.get(url, {}).then(response => response.data);
  },

  async getOne({ settingId }) {
    return api.get(`${configService.get('apiUrl')}/setting/${settingId}`, {}).then(response => response.data);
  },

  async postOne({ setting } = {}) {
    return api.post(`${configService.get('apiUrl')}/setting`, setting).then(response => response.data);
  },

  async patchOne({ settingId, newSetting }) {
    return api.patch(`${configService.get('apiUrl')}/setting/${settingId}`, newSetting).then(response => response.data);
  },

  async deleteOne({ settingId }) {
    return api.delete(`/setting/${settingId}`).then(response => response.data);
  }
};
