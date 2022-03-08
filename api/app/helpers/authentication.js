const config = require('config');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { logger } = require('./logger');
const userModel = require('../models/userModel');

const moduleLogger = logger.child({ module: 'authentication' });
const secretKey = config.get('jwt.secretKey');
const expiresIn = config.get('jwt.expiresIn');
const refreshSecretKey = config.get('jwt.refreshSecretKey');
const refreshExpiresIn = config.get('jwt.refreshExpiresIn');

const generateToken = data => {
  moduleLogger.debug('generating new token', { secretKey, expiresIn });
  return jwt.sign(data, secretKey, {
    algorithm: 'HS256',
    expiresIn
  });
};

const generateRefreshToken = data => {
  moduleLogger.debug('generating new refresh token', { refreshSecretKey, refreshExpiresIn });
  return jwt.sign(data, refreshSecretKey, {
    algorithm: 'HS256',
    expiresIn: refreshExpiresIn
  });
};

const verifyToken = async jwtToken => {
  try {
    return jwt.verify(jwtToken, secretKey, { algorithm: 'HS256' });
  } catch (e) {
    moduleLogger.error({ e }, 'verifyToken failed');
    return null;
  }
};

const verifyRefreshToken = async jwtToken => {
  try {
    return jwt.verify(jwtToken, refreshSecretKey, { algorithm: 'HS256' });
  } catch (e) {
    moduleLogger.error({ e }, 'verifyRefreshToken failed');
    return null;
  }
};

const getTokenData = async req => verifyToken(req.headers.authorization);

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
      return res.status(401).json({
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
        status: 403,
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
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  isAuthenticated,
  getTokenData
};
