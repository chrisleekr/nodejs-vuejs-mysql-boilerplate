const _ = require('lodash');
const todoModel = require('../../../models/todoModel');

module.exports = {
  name: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Todo must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Todo should be at least 200 chars long.',
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
    isEmpty: {
      errorMessage: 'State must be provided.',
      negated: true
    },
    custom: {
      options: value => {
        const valid = _.includes(todoModel.todoState, value);
        if (!valid) {
          throw new Error('State must be valid.');
        }

        return true;
      }
    }
  }
};
