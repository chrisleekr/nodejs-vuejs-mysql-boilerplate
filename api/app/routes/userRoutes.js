const { checkSchema } = require('express-validator');
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../helpers/authentication');

const user = require('./validations/user');

module.exports = app => {
  app
    .route('/user')
    .get([isAuthenticated, checkSchema(user.userListGet)], userController.listUsers)
    .post([isAuthenticated, checkSchema(user.userPost)], userController.postUser);

  app
    .route('/user/:id')
    .get([isAuthenticated, checkSchema(user.userGet)], userController.getUser)
    .patch([isAuthenticated, checkSchema(user.userPatch)], userController.patchUser)
    .delete([isAuthenticated, checkSchema(user.userDelete)], userController.deleteUser);
};
