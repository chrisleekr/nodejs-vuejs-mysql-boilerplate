import axios from 'axios';
import configService from '@/services/configService';

export default {
  async me() {
    return axios
      .get(`${configService.get('apiUrl')}/me`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },
  async updateMe(me) {
    return axios
      .post(`${configService.get('apiUrl')}/me`, me)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};
