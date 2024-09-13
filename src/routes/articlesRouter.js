const { Router } = require('express');
const articlesController = require('../controllers/articlesController');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const { validateArticleCreation } = require('../validators/articleValidators');

const articlesRouter = Router();

articlesRouter.get('/', articlesController.articlesGetAll);

articlesRouter.post(
  '/',
  verifyToken,
  authorizeRoles(['author']),
  validateArticleCreation,
  articlesController.articlesCreate
);

articlesRouter.get('/:articleId', articlesController.articlesGetById);

articlesRouter.put('/:articleId', articlesController.articlesUpdateById);

articlesRouter.delete('/:articleId', articlesController.articlesDeleteById);

module.exports = articlesRouter;
