import _ from 'lodash';
import moment from 'moment';

const toQueryStrings = params =>
  Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');

const validateDateTime = async value => {
  if (_.isEmpty(value)) {
    return true;
  }

  return moment.parseZone(value, 'YYYY-MM-DD HH:MM:SS').isValid();
};

export default {
  toQueryStrings,
  validateDateTime
};
