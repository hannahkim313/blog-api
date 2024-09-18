const { Router } = require('express');
const articlesController = require('../controllers/articlesController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const {
  validateArticleCreation,
  validateArticleId,
  validateArticleUpdate,
} = require('../validators/articleValidators');
const checkArticleOwnership = require('../middleware/checkArticleOwnership');

const articlesRouter = Router();

articlesRouter.get('/', verifyToken, articlesController.articlesGetAll);

articlesRouter.post(
  '/',
  verifyToken,
  authorizeRoles(['author']),
  validateArticleCreation,
  articlesController.articlesCreate
);

articlesRouter.get(
  '/:articleId',
  verifyToken,
  validateArticleId,
  articlesController.articlesGetById
);

articlesRouter.put(
  '/:articleId',
  verifyToken,
  authorizeRoles(['author']),
  validateArticleId,
  checkArticleOwnership,
  validateArticleUpdate,
  articlesController.articlesUpdateById
);

articlesRouter.delete(
  '/:articleId',
  verifyToken,
  authorizeRoles(['author']),
  validateArticleId,
  checkArticleOwnership,
  articlesController.articlesDeleteById
);

module.exports = articlesRouter;
