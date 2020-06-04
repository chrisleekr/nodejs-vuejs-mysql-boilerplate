import axios from 'axios';
import * as vueConfig from '../../vue.config';

class ConfigService {
  constructor() {
    this.config = {};
  }

  loadConfig() {
    axios.get(`${vueConfig.publicPath}static/config.json`).then(response => {
      this.config = response.data;
    });
  }

  set(key, value) {
    this.config[key] = value;
  }

  get(key) {
    return this.config[key];
  }
}

export default new ConfigService();
