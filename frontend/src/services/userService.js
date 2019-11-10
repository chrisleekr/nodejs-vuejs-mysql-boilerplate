import axios from 'axios';
import configService from '@/services/configService';

export default {
  async me() {
    return axios
      .get(`${configService.get('apiHost')}/me`, {})
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  },
  async updateMe(me) {
    return axios
      .post(`${configService.get('apiHost')}/me`, me)
      .then(response => {
        return response.data;
      })
      .catch(e => {
        throw e;
      });
  }
};
