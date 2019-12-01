const moment = require('moment');
const _ = require('lodash');
const userModel = require('../../../models/userModel');
const permissionModel = require('../../../models/permissionModel');

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
        return true;
      }
    }
  },
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
    optional: {
      options: [{ checkFalsy: true }]
    }
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
        if (_.isEmpty(value)) {
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
        if (_.isEmpty(value)) {
          return true;
        }

        if (moment(value, 'YYYY-MM-DD HH:mm').isValid() === false) {
          throw new Error('Confirmed date/time must be valid format. i.e. 2019-12-01 00:11');
        }

        return true;
      }
    },
    customSanitizer: {
      options: value => {
        if (_.isEmpty(value)) {
          return null;
        }
        return moment(value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
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

        if (moment(value, 'YYYY-MM-DD HH:mm').isValid() === false) {
          throw new Error('Blocked date/time must be valid format. i.e. 2019-12-01 00:11');
        }

        return true;
      }
    },
    customSanitizer: {
      options: value => {
        if (_.isEmpty(value)) {
          return null;
        }
        return moment(value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm');
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
