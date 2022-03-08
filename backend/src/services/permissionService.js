import _ from 'lodash';
import configService from '@/services/configService';
import utils from '@/helper/utils';

import api from './api';

export default {
  async list({ query = {} } = {}) {
    const pickedQuery = _.pick(query, ['page', 'page_size', 'q']);
    let url = `${configService.get('apiUrl')}/permission`;
    if (pickedQuery.length) {
      url += `?${utils.toQueryStrings(pickedQuery)}`;
    }

    return api.get(url, {}).then(response => response.data);
  }
};
