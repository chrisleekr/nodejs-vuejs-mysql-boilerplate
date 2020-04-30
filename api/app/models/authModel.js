const _ = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const { logger } = require('../helpers/logger');
const { generateToken } = require('../helpers/authentication');

const userModel = require('./userModel');
const mail = require('../helpers/mail');

const moduleLogger = logger.child({ module: 'authModel' });

const processLogin = async (user, { ipAddress }) => {
  // Update auth_key, auth_key, last_login_at, last_login_ip
  const data = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role,
    permission_keys: _.reduce(
      user.permissions,
      (acc, permission, _index) => {
        acc.push(permission.permission_key);
        return acc;
      },
      []
    )
  };

  const jwtToken = generateToken(data);

  const newUser = {
    id: user.id,
    last_login_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    last_login_ip: ipAddress
  };

  moduleLogger.debug(newUser, 'Updating user information with ');
  await userModel.updateOne(user.id, newUser);

  return { auth_key: jwtToken };
};

const login = async (username, password, roles = [userModel.userRole.user], { ipAddress = '' } = {}) => {
  const user = await userModel.getOne({
    searchOptions: {
      usernameOrEmail: username,
      enabled: userModel.userEnabled.active,
      status: userModel.userStatus.active,
      roles
    },
    includePasswordHash: true,
    includePermissions: true
  });

  if (user.length === 0) {
    moduleLogger.debug('User not found.');
    throw new Error('Your username or password is incorrect.');
  }

  if (user.blocked_at !== null && user.blocked_at !== '') {
    moduleLogger.debug('User is blocked to login.');
    throw new Error('You are not allowed to login.');
  }

  if (user.confirmed_at === null || user.confirmed_at === '') {
    moduleLogger.debug('User is not confirmed yet.');
    throw new Error('Your email is not verified. Please verify your email and try again.');
  }

  if (bcrypt.compareSync(password, user.password_hash) === false) {
    moduleLogger.debug('Incorrect password.');
    throw new Error('Your username or password is incorrect. Please try again.');
  }

  moduleLogger.debug(
    {
      user,
      ipAddress
    },
    'Password is matching. Processing login'
  );

  let result = {};
  try {
    result = await processLogin(user, { ipAddress });
  } catch (e) {
    moduleLogger.error(e, 'Error occurred while processing login');

    throw new Error('There was a problem while processing login request. Please try again.');
  }

  return result;
};

const register = async (
  { username, password, firstName, lastName, email, registrationIp, role, status },
  { apiURL }
) => {
  const authKey = uuidv4();

  const result = await userModel.insertOne({
    username,
    auth_key: authKey,
    auth_key_expired_at: null,
    first_name: firstName,
    last_name: lastName,
    password,
    email,
    confirmed_at: null,
    registration_ip: registrationIp,
    last_login_at: null,
    last_login_ip: null,
    blocked_at: null,
    role,
    enabled: userModel.userEnabled.active,
    status
  });

  // Send email to user with confirmation URL
  await mail.sendEmail({
    to: email,
    subject: 'Email verification',
    templatePath: 'app/templates/register-confirm.html',
    templateValues: {
      first_name: firstName,
      verification_link: `${apiURL}/register-confirm?key=${authKey}`
    }
  });
  return result;
};

const registerConfirm = async ({ authKey }) => {
  const user = await userModel.getOne({
    searchOptions: { auth_key: authKey, status: userModel.userStatus.pending }
  });

  const result = await userModel.updateOne(user.id, {
    auth_key: null,
    auth_key_expired_at: null,
    confirmed_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    status: userModel.userStatus.active
  });

  return result;
};

const passwordResetRequest = async ({ email }, { apiURL }) => {
  const user = await userModel.getOne({
    searchOptions: { email, status: userModel.userStatus.active }
  });

  if (_.isEmpty(user)) {
    moduleLogger.error({ user }, 'Cannot find requested user');
    throw new Error('The system could not find the requested user.');
  }

  const passwordResetToken = uuidv4();

  const result = await userModel.updateOne(user.id, {
    password_reset_token: passwordResetToken
  });

  // Send email to user with confirmation URL
  await mail.sendEmail({
    to: email,
    subject: 'Password reset',
    templatePath: 'app/templates/password-reset.html',
    templateValues: {
      first_name: user.first_name,
      password_reset_link: `${apiURL}/password-reset-verify?key=${passwordResetToken}`
    }
  });
  return result;
};

const passwordReset = async ({ password, passwordResetToken }) => {
  const user = await userModel.getOne({
    searchOptions: { password_reset_token: passwordResetToken, status: userModel.userStatus.active }
  });

  const result = await userModel.updateOne(user.id, {
    password,
    password_reset_token: null
  });

  return result;
};

module.exports = { login, register, registerConfirm, passwordResetRequest, passwordReset };
