module.exports = {
  refreshToken: {
    in: ['body'],
    isEmpty: {
      errorMessage: 'RefreshToken must be provided.',
      negated: true
    }
  }
};
