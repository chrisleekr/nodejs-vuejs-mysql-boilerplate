const authLoginPost = require('./auth/loginPost');
const authRegisterPost = require('./auth/registerPost');
const authRegisterConfirmGet = require('./auth/registerConfirmGet');
const authPasswordResetRequestPost = require('./auth/passwordResetRequestPost');
const authPasswordResetVerifyGet = require('./auth/passwordResetVerifyGet');
const authPasswordResetPost = require('./auth/passwordResetPost');

module.exports = {
  authLoginPost,
  authRegisterPost,
  authRegisterConfirmGet,
  authPasswordResetRequestPost,
  authPasswordResetVerifyGet,
  authPasswordResetPost
};
