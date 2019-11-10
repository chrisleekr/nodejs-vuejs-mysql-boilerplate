const _ = require('lodash');
const userModel = require('../models/userModel');
const { logger } = require('../helpers/logger');
const {
  handleValidationError,
  handleCustomValidationError,
  handleNotFound,
  handleSuccess
} = require('../helpers/response');
const { getIPAddress } = require('../helpers/util');

const moduleLogger = logger.child({ module: 'userController' });

const listUsers = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const result = await userModel.findAll({
    searchOptions: {
      q: req.query.q || undefined
    },
    page: req.query.page || 1,
    pageSize: req.query.page_size || 10
  });
  return handleSuccess(res, '', result);
};

const getUser = async (req, res) => {
  const row = await userModel.getOne({
    searchOptions: {
      id: req.params.id
    }
  });

  if (_.isEmpty(row)) {
    return handleNotFound(res, 'User does not exist in our database.');
  }

  return handleSuccess(res, '', row);
};

const postUser = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    // get registration ip
    if (!req.body.registration_ip) {
      req.body.registration_ip = getIPAddress(req);
    }

    const result = await userModel.insertOne(req.body);
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

const patchUser = async (req, res) => {
  const user = await userModel.getOne({ searchOptions: { id: req.params.id } });
  if (_.isEmpty(user)) {
    return handleNotFound(res, 'User does not exist in our database.');
  }

  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    const result = await userModel.updateOne(req.params.id, req.body);
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

const deleteUser = async (req, res) => {
  const user = await userModel.getOne({ searchOptions: { id: req.params.id } });
  if (_.isEmpty(user)) {
    return handleNotFound(res, 'User does not exist in our database.');
  }

  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
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
