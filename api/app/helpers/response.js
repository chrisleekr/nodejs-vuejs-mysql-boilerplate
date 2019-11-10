const { validationResult } = require('express-validator');

const emitValidationResponse = (res, errorArray) => {
  return res.status(422).json({
    success: false,
    status: 422,
    message: errorArray.length === 1 ? 'There is a validation error.' : 'There are validation errors',
    data: errorArray
  });
};

const handleValidationError = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorArray = errors.array();
    return emitValidationResponse(res, errorArray);
  }
  return null;
};

const handleCustomValidationError = (res, errorArray) => {
  return emitValidationResponse(res, errorArray);
};

const handleSuccess = (res, message, data) => {
  return res.status(200).json({
    success: true,
    status: 200,
    message,
    data
  });
};

const handleNotFound = (res, message) => {
  return res.status(404).json({
    success: false,
    status: 404,
    message,
    data: {}
  });
};

const handleRedirect = (res, status = 302, url) => {
  return res.redirect(status, url);
};

module.exports = {
  handleValidationError,
  handleCustomValidationError,
  handleNotFound,
  handleSuccess,
  handleRedirect
};
