const { checkSchema } = require('express-validator');
const meController = require('../controllers/meController');
const { isAuthenticated } = require('../helpers/authentication');

const me = require('./validations/me');

module.exports = app => {
  app
    .route('/me')
    .get([isAuthenticated, checkSchema(me.meGet)], meController.getMe)
    .post([isAuthenticated, checkSchema(me.mePatch)], meController.patchMe);
};
