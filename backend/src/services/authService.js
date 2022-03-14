import configService from '@/services/configService';
import api from './api';

export default {
  async login(username, password) {
    return api
      .post(`${configService.get('apiUrl')}/staff/login`, {
        username,
        password
      })
      .then(response => response.data);
  }
};
