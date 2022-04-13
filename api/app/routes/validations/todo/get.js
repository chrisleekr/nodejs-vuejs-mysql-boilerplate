const _ = require('lodash');
const todoModel = require('../../../models/todoModel');

module.exports = {
  id: {
    in: ['params'],
    isNumeric: {
      errorMessage: 'ID must be number',
      options: { no_symbols: true }
    },
    custom: {
      options: async todoId => {
        // Retrieve the todo
        const todo = await todoModel.getOne({
          searchOptions: { id: todoId }
        });

        // If requested todo does not exist, then return error
        if (_.isEmpty(todo)) {
          throw new Error('Todo does not exist in the database.');
        }
        return true;
      }
    }
  }
};
