const moment = require('moment');
const _ = require('lodash');
const userModel = require('../../../models/userModel');

module.exports = {
  first_name: {
    in: ['body'],
    isLength: {
      errorMessage: 'First name should be less than 50 chars long.',
      options: { max: 50 }
    }
  },
  last_name: {
    in: ['body'],
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
    optional: { options: { nullable: true } }
  },
  email: {
    in: ['body'],
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
        // Check duplicated email except current user
        const user = await userModel.getOne({
          searchOptions: { email: value, excludeId: req.params.id },
          includeDeletedUser: false
        });

        if (_.isEmpty(user) === false) {
          throw new Error('Email is already in use.');
        }
        return true;
      }
    }
  },
  confirmed_at: {
    in: ['body'],
    custom: {
      options: value => {
        if (value === undefined) {
          return true;
        }

        if (moment(value, 'YYYY-MM-DD HH:mm:ss').isValid() === false) {
          throw new Error('Confirmed date/time must be valid format. i.e. 2019-12-01 00:11:10');
        }

        return true;
      }
    },
    customSanitizer: {
      options: value => {
        if (value === undefined) {
          return null;
        }
        return moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      }
    }
  },
  blocked_at: {
    in: ['body'],
    custom: {
      options: value => {
        if (value === undefined) {
          return true;
        }

        if (moment(value, 'YYYY-MM-DD HH:mm:ss').isValid() === false) {
          throw new Error('Blocked date/time must be valid format. i.e. 2019-12-01 00:11:10');
        }

        return true;
      }
    },
    customSanitizer: {
      options: value => {
        if (value === undefined) {
          return null;
        }
        return moment(value, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      }
    }
  },
  role: {
    in: ['body'],
    custom: {
      options: value => {
        const valid = _.includes(userModel.userRole, value);
        if (!valid) {
          throw new Error('Role must be valid.');
        }

        return true;
      }
    }
  },
  status: {
    in: ['body'],
    custom: {
      options: value => {
        const valid = _.includes(userModel.userStatus, value);
        if (!valid) {
          throw new Error('Status must be valid.');
        }

        return true;
      }
    }
  }
};
