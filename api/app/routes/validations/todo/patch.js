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
  },
  name: {
    in: ['body'],
    isLength: {
      errorMessage: 'Todo should be less than 200 chars long.',
      options: { max: 200 }
    }
  },
  note: {
    in: ['body'],
    isLength: {
      errorMessage: 'Note should be less than 1000 chars long.',
      options: { max: 1000 }
    }
  },
  state: {
    in: ['body'],
    custom: {
      options: value => {
        if (value === undefined) {
          return true;
        }

        const valid = _.includes(todoModel.todoState, value);
        if (!valid) {
          throw new Error('State must be valid.');
        }

        return true;
      }
    }
  }
};
