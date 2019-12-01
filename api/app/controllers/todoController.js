const _ = require('lodash');
const { matchedData } = require('express-validator');
const todoModel = require('../models/todoModel');
const userModel = require('../models/userModel');
const { logger } = require('../helpers/logger');
const {
  validateRequest,
  handleCustomValidationError,
  handleNotFound,
  handleSuccess,
  handleForbidden
} = require('../helpers/response');
const { getTokenData } = require('../helpers/authentication');

const moduleLogger = logger.child({ module: 'todoController' });

/**
 * Return list of todos
 *  - When user requests, it only returns todo list for the user.
 *  - When staff requests, it returns all user's todo list.
 */
const listTodos = async (req, res) => {
  const tokenData = await getTokenData(req);

  // Validate request
  const validationRequest = await validateRequest(req, res, {
    permissionKey: tokenData.role !== userModel.userRole.user ? 'manageTodo' : null
  });

  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters

  const { state } = req.params;

  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  const searchOptions = {
    q: params.q || undefined
  };

  if (tokenData.role === userModel.userRole.user) {
    searchOptions.user_id = tokenData.id;
  }
  if (state !== undefined && state !== '') {
    searchOptions.state = state;
  }

  const result = await todoModel.findAll({
    searchOptions,
    page: params.page || 1,
    pageSize: params.page_size || 999999
  });
  return handleSuccess(res, '', result);
};

/**
 * Get single todo
 *  - This request only can be performed by the user role.
 */
const getTodo = async (req, res) => {
  const tokenData = await getTokenData(req);

  // Validate request
  if (tokenData.role !== userModel.userRole.user) {
    return handleForbidden(res, 'Only user can retrieve todo.');
  }
  const validationRequest = await validateRequest(req, res, {});
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  const searchOptions = {
    id: params.todoId,
    user_id: tokenData.id,
    status: todoModel.todoStatus.active
  };

  const row = await todoModel.getOne({
    searchOptions
  });

  if (_.isEmpty(row)) {
    return handleNotFound(res, 'Todo does not exist in our database.');
  }

  return handleSuccess(res, '', row);
};

/**
 * Insert single todo
 *  - This request only can be performed by the user role.
 */
const postTodo = async (req, res) => {
  const tokenData = await getTokenData(req);

  // Validate request
  if (tokenData.role !== userModel.userRole.user) {
    return handleForbidden(res, 'Only user can post todo.');
  }
  const validationRequest = await validateRequest(req, res, {});
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const { state } = req.params;
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  try {
    // Override user id
    params.user_id = tokenData.id;

    // Get position
    const searchOptions = {
      user_id: tokenData.id,
      state,
      status: todoModel.todoStatus.active
    };

    params.position = await todoModel.getMaxPosition({
      searchOptions
    });
    // Override status
    params.status = todoModel.todoStatus.active;

    const result = await todoModel.insertOne(params);
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

/**
 * Post todo list
 *  - This request only can be performed by the user role.
 */
const postTodos = async (req, res) => {
  const tokenData = await getTokenData(req);

  // Validate request
  if (tokenData.role !== userModel.userRole.user) {
    return handleForbidden(res, 'Only user can post list of todo.');
  }
  const validationRequest = await validateRequest(req, res, {});
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Get state
  const { state } = req.params;

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  // Get todo and assign state
  const { todo } = params;

  try {
    // Override user id
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

/**
 * Update single todo
 *  - This request only can be performed by the user role.
 */
const patchTodo = async (req, res) => {
  const tokenData = await getTokenData(req);

  // Validate request
  if (tokenData.role !== userModel.userRole.user) {
    return handleForbidden(res, 'Only user can patch todo.');
  }
  const validationRequest = await validateRequest(req, res, {});
  if (validationRequest !== null) {
    return validationRequest;
  }

  // Retrieve only valid parameters
  const params = matchedData(req, {
    includeOptionals: true,
    onlyValidData: true
  });

  try {
    const result = await todoModel.updateOne(params.todoId, params);
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

/**
 * Delete single todo
 *  - This request only can be performed by the user role.
 */
const deleteTodo = async (req, res) => {
  const tokenData = await getTokenData(req);

  // Validate request
  if (tokenData.role !== userModel.userRole.user) {
    return handleForbidden(res, 'Only user can delete todo.');
  }
  const validationRequest = await validateRequest(req, res, {});

  if (validationRequest !== null) {
    return validationRequest;
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
