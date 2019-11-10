const userListGet = require('./user/listGet');
const userGet = require('./user/get');
const userPost = require('./user/post');
const userPatch = require('./user/patch');
const userDelete = require('./user/delete');

module.exports = {
  userListGet,
  userGet,
  userPost,
  userPatch,
  userDelete
};
