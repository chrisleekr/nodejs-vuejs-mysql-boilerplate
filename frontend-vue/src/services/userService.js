import configService from '@/services/configService';
import api from './api';

export default {
  async me() {
    return api
      .get(`${configService.get('apiUrl')}/me`, {})
      .then(response => response.data)
      .catch(e => {
        throw e;
      });
  },
  async updateMe(me) {
    return api
      .post(`${configService.get('apiUrl')}/me`, me)
      .then(response => response.data)
      .catch(e => {
        throw e;
      });
  }
};
