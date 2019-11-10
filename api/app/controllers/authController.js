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

  try {
    const result = await authModel.login(req.body.username, req.body.password, {
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

  try {
    const result = await authModel.register({
      username: req.body.username,
      password: req.body.password,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      email: req.body.email,
      registrationIp: getIPAddress(req),
      role: userModel.userRole.user,
      status: userModel.userStatus.pending
    });

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
  if (!errors.isEmpty()) {
    return handleRedirect(res, 302, `${process.env.FRONTEND_URL}/login?messageKey=registerConfirmValidationError`);
  }

  try {
    await authModel.registerConfirm({
      authKey: req.query.key
    });

    return handleRedirect(res, 302, `${process.env.FRONTEND_URL}/login?messageKey=registerConfirmSuccess`);
  } catch (e) {
    moduleLogger.error({ e }, 'Email confirmation failed');
    return handleRedirect(res, 302, `${process.env.FRONTEND_URL}/login?messageKey=registerConfirmFailed`);
  }
};

const passwordResetRequest = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    const result = await authModel.passwordResetRequest({
      email: req.body.email
    });

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
  if (!errors.isEmpty()) {
    return handleRedirect(
      res,
      302,
      `${process.env.FRONTEND_URL}/password-reset-request?messageKey=passwordResetValidationError`
    );
  }

  try {
    return handleRedirect(
      res,
      302,
      `${process.env.FRONTEND_URL}/password-reset?messageKey=passwordResetTokenConfirmed&key=${req.query.key}`
    );
  } catch (e) {
    moduleLogger.error({ e }, 'Password reset token validation failed');
    return handleRedirect(
      res,
      302,
      `${process.env.FRONTEND_URL}/password-reset-request?messageKey=passwordResetRequestFailed`
    );
  }
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

module.exports = {
  login,
  register,
  registerConfirm,
  passwordResetRequest,
  passwordResetVerify,
  passwordReset
};
