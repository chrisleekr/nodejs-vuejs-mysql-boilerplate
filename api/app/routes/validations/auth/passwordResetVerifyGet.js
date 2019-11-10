const _ = require('lodash');
const userModel = require('../../../models/userModel');

module.exports = {
  key: {
    in: ['query'],
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
  }
};
