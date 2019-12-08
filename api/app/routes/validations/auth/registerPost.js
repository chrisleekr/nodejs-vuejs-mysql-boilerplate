const _ = require('lodash');
const userModel = require('../../../models/userModel');

module.exports = {
  username: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Username must be provided.',
      negated: true
    },
    custom: {
      options: async value => {
        if (value === undefined) {
          return false;
        }
        // Check duplicated username
        const user = await userModel.getOne({
          searchOptions: { username: value },
          includeDeletedUser: true
        });

        if (_.isEmpty(user) === false) {
          throw new Error('Username is already in use.');
        }
        return true;
      }
    }
  },
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
      errorMessage: 'First name must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Last name should be less than 50 chars long.',
      options: { max: 50 }
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
      options: async value => {
        // Check duplicated email
        const user = await userModel.getOne({
          searchOptions: { email: value },
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
