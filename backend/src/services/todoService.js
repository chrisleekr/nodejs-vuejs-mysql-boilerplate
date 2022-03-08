import configService from '@/services/configService';
import api from './api';

export default {
  async list({ state = undefined } = {}) {
    let url = `${configService.get('apiUrl')}/todo`;
    if (state) {
      url += `/${state}`;
    }

    return api.get(url, {}).then(response => response.data);
  }
};
