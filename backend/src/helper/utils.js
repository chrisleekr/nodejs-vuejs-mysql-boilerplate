import _ from 'lodash';
import moment from 'moment';

const toQueryStrings = params => {
  return Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');
};

const validateDateTime = async value => {
  if (_.isEmpty(value)) {
    return true;
  }

  return moment.parseZone(value).isValid();
};

export default {
  toQueryStrings,
  validateDateTime
};
