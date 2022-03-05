const authLoginPost = require('./auth/loginPost');
const authRegisterPost = require('./auth/registerPost');
const authRegisterConfirmGet = require('./auth/registerConfirmGet');
const authPasswordResetRequestPost = require('./auth/passwordResetRequestPost');
const authPasswordResetVerifyGet = require('./auth/passwordResetVerifyGet');
const authPasswordResetPost = require('./auth/passwordResetPost');
const authRefreshTokenPost = require('./auth/refreshTokenPost');

module.exports = {
  authLoginPost,
  authRegisterPost,
  authRegisterConfirmGet,
  authPasswordResetRequestPost,
  authPasswordResetVerifyGet,
  authPasswordResetPost,
  authRefreshTokenPost
};
