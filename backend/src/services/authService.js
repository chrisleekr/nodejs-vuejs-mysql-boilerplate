import axios from 'axios';
import configService from '@/services/configService';

export default {
  async login(username, password) {
    return axios
      .post(`${configService.get('apiUrl')}/staff/login`, {
        username,
        password
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};
