const { Router } = require('express');
const articlesController = require('../controllers/articlesController');

const articlesRouter = Router();

articlesRouter.get('/', articlesController.articlesGetAll);
articlesRouter.post('/', articlesController.articlesCreate);
articlesRouter.get('/:articleId', articlesController.articlesGetById);
articlesRouter.put('/:articleId', articlesController.articlesUpdateById);
articlesRouter.delete('/:articleId', articlesController.articlesDeleteById);

module.exports = articlesRouter;
