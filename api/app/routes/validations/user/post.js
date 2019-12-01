const moment = require('moment');
const _ = require('lodash');
const userModel = require('../../../models/userModel');
const permissionModel = require('../../../models/permissionModel');

module.exports = {
  username: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Username must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Username must be between 3 and 15 character length.',
      options: { min: 3, max: 15 }
    },
    custom: {
      options: async value => {
        if (_.isEmpty(value)) {
          return false;
        }
        // Check duplicated username
        const user = await userModel.getOne({
          searchOptions: { username: value },
          includeDeletedUser: false
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
        if (_.isEmpty(value)) {
          return false;
        }
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
  },
  confirmed_at: {
    in: ['body'],
    custom: {
      options: value => {
        if (_.isEmpty(value)) {
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
        if (_.isEmpty(value)) {
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
        if (_.isEmpty(value)) {
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
        if (_.isEmpty(value)) {
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
  permissions: {
    in: ['body'],
    custom: {
      options: async userPermissionIds => {
        const permissions = await permissionModel.findAll({});
        _.each(userPermissionIds, permissionId => {
          if (_.some(permissions, { id: permissionId }) === false) {
            throw new Error('Permission must be valid.');
          }
        });

        return true;
      }
    }
  },
  enabled: {
    in: ['body'],
    custom: {
      options: value => {
        const valid = _.includes(userModel.userEnabled, value);
        if (!valid) {
          throw new Error('Enabled must be valid.');
        }

        return true;
      }
    }
  }
};
