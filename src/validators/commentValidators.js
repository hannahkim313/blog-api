const { body, check } = require('express-validator');

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

const validateCommentId = [
  check('commentId')
    .isInt({ gt: 0 })
    .withMessage('Comment ID must be a positive integer'),
];

module.exports = {
  validateComment,
  validateCommentUpdate,
  validateCommentId,
};
