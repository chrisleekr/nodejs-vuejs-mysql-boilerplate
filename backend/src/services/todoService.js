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
      .then(response => response.data)
      .catch(e => {
        throw e;
      });
  }
};
