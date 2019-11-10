const getIPAddress = req => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
};

module.exports = { getIPAddress };
