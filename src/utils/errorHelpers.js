require('dotenv').config();
const { validationResult } = require('express-validator');

const logError = (message) => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(message);
  }
};

const handleValidationErrors = (req, res, status, message) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    logError(errorMessages);
    res.status(status).json({ status, message });

    return true;
  }

  return false;
};

const handleCustomErrors = (err) => {
  logError('An error occurred');

  throw new Error(err.message);
};

module.exports = {
  logError,
  handleValidationErrors,
  handleCustomErrors,
};
