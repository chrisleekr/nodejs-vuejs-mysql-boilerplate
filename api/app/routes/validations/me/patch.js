const _ = require('lodash');
const userModel = require('../../../models/userModel');
const { getTokenData } = require('../../../helpers/authentication');

module.exports = {
  first_name: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'First name must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'First name should be less than 50 chars long.',
      options: { max: 50 }
    }
  },
  last_name: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Last name must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Last name should be less than 50 chars long.',
      options: { max: 50 }
    }
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password should be at least 6 chars long.',
      options: { min: 6 }
    },
    optional: { options: { nullable: true, checkFalsy: true } }
  },
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
      options: async (value, { req }) => {
        if (value === undefined) {
          return false;
        }
        const tokenData = await getTokenData(req);
        if (!tokenData) {
          return false;
        }

        // Check duplicated email
        const user = await userModel.getOne({
          searchOptions: { email: value, excludeId: tokenData.id },
          includeDeletedUser: false
        });

        if (_.isEmpty(user) === false) {
          throw new Error('Email is already in use.');
        }
        return true;
      }
    }
  }
};
