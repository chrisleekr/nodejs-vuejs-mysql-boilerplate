import _ from 'lodash';
import moment from 'moment';

const toQueryStrings = params =>
  Object.keys(params)
    .map(key => `${key}=${params[key]}`)
    .join('&');

const validateDateTime = value => {
  if (_.isEmpty(value)) {
    return true;
  }

  return moment.parseZone(value).isValid();
};

export default {
  toQueryStrings,
  validateDateTime
};
