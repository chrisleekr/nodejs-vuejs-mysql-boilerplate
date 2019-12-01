const _ = require('lodash');
const userModel = require('../../../models/userModel');

module.exports = {
  id: {
    in: ['params'],
    isNumeric: {
      errorMessage: 'ID must be number',
      options: { no_symbols: true }
    },
    custom: {
      options: async (userId, { req }) => {
        // Retrieve the user
        const user = await userModel.getOne({
          searchOptions: { id: userId, roles: userModel.getUserRoles(req.params.roleType) }
        });

        // If requested user does not exist, then return error
        if (_.isEmpty(user)) {
          throw new Error('User does not exist in the database.');
        }

        if (+userId === 1) {
          throw new Error('Root administrator cannot be deleted.');
        }

        return true;
      }
    }
  }
};
