const todoListGet = require('./todo/listGet');
const todoListPost = require('./todo/listPost');
const todoGet = require('./todo/get');
const todoPost = require('./todo/post');
const todoPatch = require('./todo/patch');
const todoDelete = require('./todo/delete');

module.exports = {
  todoListGet,
  todoListPost,
  todoGet,
  todoPost,
  todoPatch,
  todoDelete
};
