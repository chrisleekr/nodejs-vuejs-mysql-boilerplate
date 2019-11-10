module.exports = {
  todo: {
    in: ['body']
  },
  'todo.*.id': {
    in: ['body'],
    isNumeric: {
      errorMessage: 'ID must be number.'
    },
    optional: { options: { nullable: true } }
  },
  'todo.*.name': {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Todo must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Todo should be less than 200 chars long.',
      options: { max: 200 }
    }
  },
  'todo.*.note': {
    in: ['body'],
    isLength: {
      errorMessage: 'Note should be less than 1000 chars long.',
      options: { max: 1000 }
    }
  }
};
