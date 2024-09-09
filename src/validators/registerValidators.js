const { body } = require('express-validator');
const {
  usernameExists,
  emailExists,
  passwordsMatch,
} = require('./customValidators');

const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isAlpha()
    .withMessage('First name must only contain letters')
    .isLength({ min: 1, max: 10 })
    .withMessage('First name must be between 1 and 10 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isAlpha()
    .withMessage('Last name must only contain letters')
    .isLength({ min: 1, max: 10 })
    .withMessage('Last name must be between 1 and 10 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail()
    .custom(emailExists),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must only contain letters, numbers, and underscores')
    .custom(usernameExists),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number.')
    .matches(/[@$!%*?&#]/)
    .withMessage('Password must contain at least one special character.'),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage('Confirm password is required.')
    .custom(passwordsMatch)
    .withMessage('The passwords do not match.'),
];

module.exports = validateRegister;
