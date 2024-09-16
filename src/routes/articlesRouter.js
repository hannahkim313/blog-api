const { Router } = require('express');
const articlesController = require('../controllers/articlesController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const {
  validateArticleCreation,
  validateArticleId,
  validateArticleUpdate,
} = require('../validators/articleValidators');

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
  validateArticleUpdate,
  articlesController.articlesUpdateById
);

articlesRouter.delete(
  '/:articleId',
  verifyToken,
  articlesController.articlesDeleteById
);

module.exports = articlesRouter;
