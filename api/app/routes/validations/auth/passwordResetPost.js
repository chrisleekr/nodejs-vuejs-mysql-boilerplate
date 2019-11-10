const _ = require('lodash');
const userModel = require('../../../models/userModel');

module.exports = {
  key: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Key must be provided.',
      negated: true
    },
    custom: {
      options: async value => {
        if (value === undefined) {
          return false;
        }
        // Check password reset token
        const user = await userModel.getOne({
          searchOptions: { password_reset_token: value, status: userModel.userStatus.active }
        });

        if (_.isEmpty(user)) {
          throw new Error('Key is invalid.');
        }
        return true;
      }
    }
  },
  password: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Password must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Password should be at least 6 chars long.',
      options: { min: 6 }
    }
  }
};
