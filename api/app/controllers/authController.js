const config = require('config');
const { validationResult } = require('express-validator');
const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const { logger } = require('../helpers/logger');
const {
  handleValidationError,
  handleCustomValidationError,
  handleSuccess,
  handleRedirect
} = require('../helpers/response');
const { getIPAddress } = require('../helpers/util');

const moduleLogger = logger.child({ module: 'authController' });

const login = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const userRoles =
    req.params.roleType === 'staff'
      ? [userModel.userRole.administrator, userModel.userRole.staff]
      : [userModel.userRole.user];

  try {
    const result = await authModel.login(req.body.username, req.body.password, userRoles, {
      ipAddress: getIPAddress(req)
    });

    return handleSuccess(res, 'You are successfully logged in.', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Login failed');
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

const register = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const userRole = userModel.userRole.user;

  const apiURL = `${config.get('apiUrl')}/user`;

  try {
    const result = await authModel.register(
      {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        email: req.body.email,
        registrationIp: getIPAddress(req),
        role: userRole,
        enabled: userModel.userEnabled.active,
        status: userModel.userStatus.pending
      },
      { apiURL }
    );

    return handleSuccess(res, 'You are successfully registered.', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Register failed');
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

const registerConfirm = async (req, res) => {
  const errors = validationResult(req);

  const appURL = config.get('frontendUrl');

  if (!errors.isEmpty()) {
    return handleRedirect(res, 302, `${appURL}/login?messageKey=registerConfirmValidationError`);
  }

  try {
    await authModel.registerConfirm({
      authKey: req.query.key
    });

    return handleRedirect(res, 302, `${appURL}/login?messageKey=registerConfirmSuccess`);
  } catch (e) {
    moduleLogger.error({ e }, 'Email confirmation failed');
    return handleRedirect(res, 302, `${appURL}/login?messageKey=registerConfirmFailed`);
  }
};

const passwordResetRequest = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const apiURL = `${config.get('apiUrl')}/user`;

  try {
    const result = await authModel.passwordResetRequest(
      {
        email: req.body.email
      },
      { apiURL }
    );

    return handleSuccess(
      res,
      'Password reset request has been processed. Please check your email and follow the link to reset password.',
      result
    );
  } catch (e) {
    moduleLogger.error({ e }, 'Password reset request failed');
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

const passwordResetVerify = async (req, res) => {
  const errors = validationResult(req);

  const appURL = config.get('frontendUrl');

  if (!errors.isEmpty()) {
    return handleRedirect(res, 302, `${appURL}/password-reset-request?messageKey=passwordResetValidationError`);
  }

  return handleRedirect(
    res,
    302,
    `${appURL}/password-reset?messageKey=passwordResetTokenConfirmed&key=${req.query.key}`
  );
};

const passwordReset = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    const result = await authModel.passwordReset({
      password: req.body.password,
      passwordResetToken: req.body.key
    });

    return handleSuccess(res, 'Your password has been updated. Please login with your new password.', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Password reset failed');
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

const refreshToken = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    const result = await authModel.refreshToken(
      {
        jwtRefreshToken: req.body.refreshToken
      },
      {
        ipAddress: getIPAddress(req)
      }
    );

    return handleSuccess(res, 'Your token has been refreshed.', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Token refresh failed');

    if (e.message === 'jwt expired') {
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Your login has been expired. Please login again.',
        data: {}
      });
    }

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
  login,
  register,
  registerConfirm,
  passwordResetRequest,
  passwordResetVerify,
  passwordReset,
  refreshToken
};
