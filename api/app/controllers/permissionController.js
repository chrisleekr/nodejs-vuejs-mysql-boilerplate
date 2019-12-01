const permissionModel = require('../models/permissionModel');
const { logger } = require('../helpers/logger');
const { validateRequest, handleSuccess } = require('../helpers/response');

const moduleLogger = logger.child({ module: 'permissionController' });

const listPermissions = async (req, res) => {
  moduleLogger.info({}, 'listPermission called');
  // Validate request
  const validationRequest = await validateRequest(req, res, {});
  if (validationRequest !== null) {
    return validationRequest;
  }

  const searchOptions = {
    q: req.query.q || undefined
  };

  const result = await permissionModel.findAll({
    searchOptions
  });
  return handleSuccess(res, '', result);
};

module.exports = {
  listPermissions
};
