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
        // Check register confirmation key
        const user = await userModel.getOne({
          searchOptions: { auth_key: value, status: userModel.userStatus.pending }
        });

        if (_.isEmpty(user)) {
          throw new Error('Key is invalid.');
        }
        return true;
      }
    }
  }
};
