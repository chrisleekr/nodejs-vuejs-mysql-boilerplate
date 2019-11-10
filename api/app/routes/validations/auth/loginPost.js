module.exports = {
  username: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Username must be provided.',
      negated: true
    }
  },
  password: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'Password must be provided.',
      negated: true
    },
    isLength: {
      errorMessage: 'Password should be at least 6 chars long.',
      options: { min: 6 }
    }
  }
};
