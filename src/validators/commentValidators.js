const { body } = require('express-validator');

const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
];

const validateCommentUpdate = [
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
];

module.exports = {
  validateComment,
  validateCommentUpdate,
};
