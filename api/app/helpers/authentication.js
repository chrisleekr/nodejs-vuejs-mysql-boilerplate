const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { logger } = require('./logger');
const userModel = require('../models/userModel');

const moduleLogger = logger.child({ module: 'authentication' });
const secretKey = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRES_IN;

const generateToken = data => {
  moduleLogger.debug('generating new token', { expiresIn });
  return jwt.sign(data, secretKey, {
    algorithm: 'HS256',
    expiresIn
  });
};

const verifyToken = async jwtToken => {
  try {
    return await jwt.verify(jwtToken, secretKey, { algorithm: 'HS256' });
  } catch (e) {
    moduleLogger.error({ e });
    return null;
  }
};

const getTokenData = async req => {
  return verifyToken(req.headers.authorization);
};

const isAuthenticated = async (req, res, next) => {
  if (typeof req.headers.authorization !== 'undefined') {
    // retrieve the authorization header and parse out the
    // JWT using the split function
    const token = req.headers.authorization;

    // Here we validate that the JSON Web Token is valid and has been
    // created using the same private pass phrase

    const data = await verifyToken(token);
    if (data === null) {
      moduleLogger.info('Verification failed. Return error.');
      return res.status(403).json({
        success: false,
        status: 401,
        message: 'Please login before to continue.',
        data: {}
      });
    }

    // get user to verify
    const user = await userModel.getOne({
      searchOptions: {
        id: data.id,
        role: data.role
      }
    });
    if (_.isEmpty(user)) {
      moduleLogger.info('User not found. Return error.');
      return res.status(403).json({
        success: false,
        status: 401,
        message: 'Please login before to continue.',
        data: {}
      });
    }

    // data is available, it means verification succeed.
    moduleLogger.debug({ data, user }, 'Verification succeed. Proceed to next.');
    return next();
  }

  // No authorization header exists on the incoming
  // request, return not authorized and throw a new error
  moduleLogger.info('No authorisation header. Return error.');
  return res.status(403).json({
    success: false,
    status: 403,
    message: 'Please login before to continue.',
    data: {}
  });
};

module.exports = {
  generateToken,
  verifyToken,
  isAuthenticated,
  getTokenData
};
