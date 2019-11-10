const { checkSchema } = require('express-validator');
const todoController = require('../controllers/todoController');
const { isAuthenticated } = require('../helpers/authentication');

const todo = require('./validations/todo');

module.exports = app => {
  app
    .route('/todo')
    .get([isAuthenticated, checkSchema(todo.todoListGet)], todoController.listTodos)
    .post([isAuthenticated, checkSchema(todo.todoPost)], todoController.postTodo);

  app
    .route('/todo/:state(pending|ongoing|completed|archived)')
    .get([[isAuthenticated, checkSchema(todo.todoListGet)], todoController.listTodos])
    .post([[isAuthenticated, checkSchema(todo.todoListPost)], todoController.postTodos]);

  app
    .route('/todo/:todoId')
    .get([isAuthenticated, checkSchema(todo.todoGet)], todoController.getTodo)
    .patch([isAuthenticated, checkSchema(todo.todoPatch)], todoController.patchTodo)
    .delete([isAuthenticated, checkSchema(todo.todoDelete)], todoController.deleteTodo);
};
