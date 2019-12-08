const _ = require('lodash');
const userModel = require('../../../models/userModel');

module.exports = {
  email: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Email must be provided.',
      negated: true
    },
    isEmail: {
      errorMessage: 'Email must be valid. i.e. john@doe.com'
    },
    normalizeEmail: true,
    isLength: {
      errorMessage: 'Email should be less than 255 chars long.',
      options: { max: 255 }
    },
    custom: {
      options: async value => {
        // Check duplicated email
        const user = await userModel.getOne({
          searchOptions: { email: value },
          includeDeletedUser: false
        });

        if (_.isEmpty(user)) {
          throw new Error('Email cannot be found.');
        }
        return true;
      }
    }
  }
};
