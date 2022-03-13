import configService from '@/services/configService';
import api from './api';

export default {
  async passwordReset({ key, password }) {
    return api
      .post(`${configService.get('apiUrl')}/user/password-reset`, {
        key,
        password
      })
      .then(response => response.data);
  },

  async passwordResetRequest({ email }) {
    return api
      .post(`${configService.get('apiUrl')}/user/password-reset-request`, {
        email
      })
      .then(response => response.data);
  },

  async register({ username, email, password, firstName, lastName }) {
    return api
      .post(`${configService.get('apiUrl')}/user/register`, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })
      .then(response => response.data);
  },

  async login(username, password) {
    return api
      .post(`${configService.get('apiUrl')}/user/login`, {
        username,
        password
      })
      .then(response => response.data);
  }
};
