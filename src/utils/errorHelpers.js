const { validationResult } = require('express-validator');
const { logError } = require('../utils/errorUtils');
const sendResponse = require('./sendResponse');

const handleValidationErrors = (req, res, status) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    logError(errorMessages);
    sendResponse(res, status);

    return true;
  }

  return false;
};

const handleCustomErrors = (err) => {
  logError('An error occurred');

  throw new Error(err.message);
};

module.exports = {
  handleValidationErrors,
  handleCustomErrors,
};
