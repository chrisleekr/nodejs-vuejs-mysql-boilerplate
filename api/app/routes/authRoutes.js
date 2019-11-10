const { checkSchema } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('./validations/auth');

module.exports = app => {
  app.route('/login').post([checkSchema(auth.authLoginPost)], authController.login);
  app.route('/register').post([checkSchema(auth.authRegisterPost)], authController.register);
  app.route('/register-confirm').get([checkSchema(auth.authRegisterConfirmGet)], authController.registerConfirm);
  app
    .route('/password-reset-request')
    .post([checkSchema(auth.authPasswordResetRequestPost)], authController.passwordResetRequest);
  app
    .route('/password-reset-verify')
    .get([checkSchema(auth.authPasswordResetVerifyGet)], authController.passwordResetVerify);
  app.route('/password-reset').post([checkSchema(auth.authPasswordResetPost)], authController.passwordReset);
};
