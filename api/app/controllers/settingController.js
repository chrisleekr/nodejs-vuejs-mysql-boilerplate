const _ = require('lodash');
const { matchedData } = require('express-validator');
const settingModel = require('../models/settingModel');
const { logger } = require('../helpers/logger');
const { validateRequest, handleCustomValidationError, handleNotFound, handleSuccess } = require('../helpers/response');

const moduleLogger = logger.child({ module: 'settingController' });

/**
 * List settings
 */
const listSettings = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: 'manageSetting'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  // Retrieve setting list
  const result = await settingModel.findAll({
    searchOptions: {
      q: params.q || undefined
    },
    page: params.page || 1,
    pageSize: params.page_size || 10
  });

  return handleSuccess(res, '', result);
};

/**
 * Get setting
 */
const getSetting = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: 'manageSetting'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve single setting based on the id and roles
  const row = await settingModel.getOne({
    searchOptions: {
      id: req.params.id
    }
  });

  // If cannot find the setting, then return error
  if (_.isEmpty(row)) {
    return handleNotFound(res, 'Setting does not exist in our database.');
  }

  return handleSuccess(res, '', row);
};

/**
 * Create new setting
 */
const postSetting = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: 'manageSetting'
  });

  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  try {
    // Force to set active setting only
    params.status = settingModel.settingStatus.active;

    // Insert new setting to the database
    const result = await settingModel.insertOne(params);

    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Creating setting failed');
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
 * Update existing setting
 */
const patchSetting = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: 'manageSetting'
  });
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  try {
    // Update the setting
    const result = await settingModel.updateOne(req.params.id, params);

    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Updating setting failed');
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
 * Delete existing setting
 */
const deleteSetting = async (req, res) => {
  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: 'manageSetting'
  });

  if (validationRequest !== null) {
    return validationRequest;
  }

  try {
    // Delete setting
    const result = await settingModel.deleteOne(req.params.id);
    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Deleting setting failed');
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
  listSettings,
  getSetting,
  postSetting,
  patchSetting,
  deleteSetting
};
