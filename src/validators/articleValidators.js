const { body, check } = require('express-validator');
const { articleExists } = require('./customValidators');

const validateArticleCreation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters')
    .custom(articleExists),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 0, max: 255 })
    .withMessage('Description must be between 1 and 255 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  body('url')
    .trim()
    .notEmpty()
    .withMessage('Url is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Url must be between 1 and 255 characters')
    .isString()
    .withMessage('Url must be a string'),
];

const validateArticleUpdate = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 0, max: 255 })
    .withMessage('Description must be between 1 and 255 characters'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string'),
  body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean'),
  body('url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Url is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Url must be between 1 and 255 characters')
    .isString()
    .withMessage('Url must be a string'),
];

const validateArticleId = [
  check('articleId')
    .isInt({ gt: 0 })
    .withMessage('Article ID must be a positive integer'),
];

module.exports = {
  validateArticleCreation,
  validateArticleUpdate,
  validateArticleId,
};
