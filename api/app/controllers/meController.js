const _ = require('lodash');
const userModel = require('../models/userModel');
const { logger } = require('../helpers/logger');
const {
  handleValidationError,
  handleSuccess,
  handleNotFound,
  handleCustomValidationError
} = require('../helpers/response');
const { getTokenData } = require('../helpers/authentication');

const moduleLogger = logger.child({ module: 'meController' });

const loadMe = async (res, id) => {
  const user = await userModel.getOne({
    searchOptions: {
      id,
      status: userModel.userStatus.active
    }
  });
  if (_.isEmpty(user)) {
    return handleNotFound(res, 'User does not exist in our database.');
  }

  return _.pick(user, ['username', 'first_name', 'last_name', 'email', 'role', 'last_login_at', 'last_login_ip']);
};

const getMe = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const tokenData = await getTokenData(req);
  const me = await loadMe(res, tokenData.id);

  moduleLogger.debug({ me }, 'Retrieved me');
  return handleSuccess(res, 'The system retrived your information.', me);
};

const patchMe = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const tokenData = await getTokenData(req);

  const user = await userModel.getOne({
    searchOptions: {
      id: tokenData.id,
      status: userModel.userStatus.active
    }
  });

  if (_.isEmpty(user)) {
    return handleNotFound(res, 'User does not exist in our database.');
  }
  moduleLogger.debug({ requestBody: req.body }, 'request body');
  const newMe = _.assign(_.pick(user, ['first_name', 'last_name', 'email']), {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email
  });

  if (req.body.password && req.body.password !== '') {
    newMe.password = req.body.password;
  }
  moduleLogger.debug({ newMe }, 'new Me');

  try {
    await userModel.updateOne(user.id, newMe);

    const me = await loadMe(res, user.id);

    moduleLogger.debug({ me }, 'Retrieved me');
    return handleSuccess(res, 'The system have updated your information.', me);
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

module.exports = {
  getMe,
  patchMe
};
