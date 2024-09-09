const { body } = require('express-validator');
const {
  isValidUsername,
  isValidPassword,
} = require('../validators/customValidators');

const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .custom(isValidUsername),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .custom(isValidPassword),
];

module.exports = validateLogin;
