const { Router } = require('express');
const commentsController = require('../controllers/commentsController');
const { validateArticleId } = require('../validators/articleValidators');
const verifyToken = require('../middleware/verifyToken');

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get(
  '/',
  verifyToken,
  validateArticleId,
  commentsController.commentsGetAll
);
commentsRouter.post('/', commentsController.commentsCreate);
commentsRouter.put('/:commentId', commentsController.commentsUpdateById);
commentsRouter.delete('/:commentId', commentsController.commentsDeleteById);

module.exports = commentsRouter;
