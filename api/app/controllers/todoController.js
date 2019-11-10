const _ = require('lodash');
const todoModel = require('../models/todoModel');
const { logger } = require('../helpers/logger');
const {
  handleValidationError,
  handleCustomValidationError,
  handleNotFound,
  handleSuccess
} = require('../helpers/response');
const { getTokenData } = require('../helpers/authentication');

const moduleLogger = logger.child({ module: 'todoController' });

const listTodos = async (req, res) => {
  const tokenData = await getTokenData(req);
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  const searchOptions = {
    q: req.query.q || undefined,
    user_id: tokenData.id
  };
  if (req.params.state !== undefined && req.params.state !== '') {
    searchOptions.state = req.params.state;
  }

  const result = await todoModel.findAll({
    searchOptions,
    page: req.query.page || 1,
    pageSize: req.query.page_size || 999999
  });
  return handleSuccess(res, '', result);
};

const getTodo = async (req, res) => {
  const tokenData = await getTokenData(req);
  const row = await todoModel.getOne({
    searchOptions: {
      id: req.params.todoId,
      user_id: tokenData.id,
      status: todoModel.todoStatus.active
    }
  });

  if (_.isEmpty(row)) {
    return handleNotFound(res, 'Todo does not exist in our database.');
  }

  return handleSuccess(res, '', row);
};

const postTodo = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    // Override user id
    const tokenData = await getTokenData(req);
    req.body.user_id = tokenData.id;

    // Get position
    req.body.position = await todoModel.getMaxPosition({
      searchOptions: {
        user_id: tokenData.id,
        state: req.body.state,
        status: todoModel.todoStatus.active
      }
    });
    // Override status
    req.body.status = todoModel.todoStatus.active;

    const result = await todoModel.insertOne(req.body);
    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Creating todo failed');
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

const postTodos = async (req, res) => {
  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  // Get state
  const { state } = req.params;

  // Get todo and assign state
  const { todo } = req.body;

  try {
    // Override user id
    const tokenData = await getTokenData(req);
    const userId = tokenData.id;

    _.forEach(todo, (val, key) => {
      const tmpTodo = val;
      tmpTodo.user_id = userId;
      tmpTodo.state = state;
      tmpTodo.position = key + 1;
      tmpTodo.status = todoModel.todoStatus.active;
      todo[key] = tmpTodo;
    });

    const result = await todoModel.upsertBulk(todo, { deleteNotInListOfState: state });

    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Updating todo failed');
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

const patchTodo = async (req, res) => {
  const tokenData = await getTokenData(req);

  const todo = await todoModel.getOne({
    searchOptions: { id: req.params.todoId, user_id: tokenData.id, status: todoModel.todoStatus.active }
  });
  if (_.isEmpty(todo)) {
    return handleNotFound(res, 'Todo does not exist in our database.');
  }

  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    const result = await todoModel.updateOne(req.params.todoId, req.body);
    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Updating todo failed');
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

const deleteTodo = async (req, res) => {
  const tokenData = await getTokenData(req);

  const todo = await todoModel.getOne({
    searchOptions: { id: req.params.todoId, user_id: tokenData.id, status: todoModel.todoStatus.active }
  });
  if (_.isEmpty(todo)) {
    return handleNotFound(res, 'Todo does not exist in our database.');
  }

  const validationResponse = handleValidationError(req, res);
  if (validationResponse !== null) {
    return validationResponse;
  }

  try {
    const result = await todoModel.deleteOne(req.params.todoId);
    return handleSuccess(res, '', result);
  } catch (e) {
    moduleLogger.error({ e }, 'Deleting todo failed');
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
  listTodos,
  postTodos,
  getTodo,
  postTodo,
  patchTodo,
  deleteTodo
};
