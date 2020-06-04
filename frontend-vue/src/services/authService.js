import axios from 'axios';
import configService from '@/services/configService';

export default {
  async passwordReset({ key, password }) {
    return axios
      .post(`${configService.get('apiUrl')}/user/password-reset`, {
        key,
        password
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async passwordResetRequest({ email }) {
    return axios
      .post(`${configService.get('apiUrl')}/user/password-reset-request`, {
        email
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async register({ username, email, password, firstName, lastName }) {
    return axios
      .post(`${configService.get('apiUrl')}/user/register`, {
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName
      })
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },

  async login(username, password) {
    return axios
      .post(`${configService.get('apiUrl')}/user/login`, {
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
