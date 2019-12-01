const _ = require('lodash');
const { matchedData } = require('express-validator');
const userModel = require('../models/userModel');
const permissionModel = require('../models/permissionModel');
const { logger } = require('../helpers/logger');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');
const { getIPAddress } = require('../helpers/util');

const moduleLogger = logger.child({ module: 'userController' });

/**
 * List users
 */
const listUsers = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: req.params.roleType === 'staff' ? 'manageStaff' : 'manageUser'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  // Retrieve user list
  const result = await userModel.findAll({
    searchOptions: {
      q: params.q || undefined,
      roles: userModel.getUserRoles(req.params.roleType)
    },
    page: params.page || 1,
    pageSize: params.page_size || 10,
    includePermissions: req.params.roleType === 'staff'
  });

  return handleSuccess(res, '', result);
};

/**
 * Get user
 */
const getUser = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: req.params.roleType === 'staff' ? 'manageStaff' : 'manageUser'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve single user based on the id and roles
  const row = await userModel.getOne({
    searchOptions: {
      id: req.params.id,
      roles: userModel.getUserRoles(req.params.roleType)
    },
    includePermissions: req.params.roleType === 'staff'
  });

  // If cannot find the user, then return error
  if (_.isEmpty(row)) {
    return handleNotFound(res, 'User does not exist in our database.');
  }

  return handleSuccess(res, '', row);
};

/**
 * Create new user
 */
const postUser = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: req.params.roleType === 'staff' ? 'manageStaff' : 'manageUser'
  });

  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  let permissionIds = [];
  // If user role is staff and permissions field is defined,
  // then get permissions to separated array and remove from parameters.
  // This permission will be processed after update the user
  if (params.role === userModel.userRole.staff && params.permissions) {
    permissionIds = params.permissions;
  }
  delete params.permissions;

  try {
    // Get registration ip if not provided
    if (!params.registration_ip) {
      params.registration_ip = getIPAddress(req);
    }

    // Force to set active user only
    params.status = userModel.userStatus.active;

    // Insert new user to the database
    const result = await userModel.insertOne(params);

    // If permissionIds variable is not empty, then refresh permission users table
    if (_.isEmpty(permissionIds) === false) {
      await permissionModel.refreshPermissionUsers(result.id, permissionIds);
    }

    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Creating user failed');
    return handleCustomValidationError(res, [
      {
        value: '',
        msg: e.message,
        param: 'general',
        location: 'body'
      }
    ]);
  }
};

/**
 * Update existing user
 */
const patchUser = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: req.params.roleType === 'staff' ? 'manageStaff' : 'manageUser'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }
  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  let permissionIds = [];
  // If user role is staff and permissions field is defined,
  // then get permissions to separated array and remove from parameters.
  // This permission will be processed after update the user
  if (params.role === userModel.userRole.staff && params.permissions) {
    permissionIds = params.permissions;
  }
  delete params.permissions;

  try {
    // Update the user
    const result = await userModel.updateOne(req.params.id, params);

    // If it is staff, process permission user
    if (params.role === userModel.userRole.staff) {
      await permissionModel.refreshPermissionUsers(req.params.id, permissionIds);
    }
    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Updating user failed');
    return handleCustomValidationError(res, [
      {
        value: '',
        msg: e.message,
        param: 'general',
        location: 'body'
      }
    ]);
  }
};

/**
 * Delete existing user
 */
const deleteUser = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: req.params.roleType === 'staff' ? 'manageStaff' : 'manageUser'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }

  try {
    // Delete user
    const result = await userModel.deleteOne(req.params.id);
    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Deleting user failed');
    return handleCustomValidationError(res, [
      {
        value: '',
        msg: e.message,
        param: 'general',
        location: 'body'
      }
    ]);
  }
};

module.exports = {
  listUsers,
  getUser,
  postUser,
  patchUser,
  deleteUser
};
