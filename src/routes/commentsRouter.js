const { Router } = require('express');
const commentsController = require('../controllers/commentsController');
const { validateArticleId } = require('../validators/articleValidators');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const {
  validateComment,
  validateCommentUpdate,
  validateCommentId,
} = require('../validators/commentValidators');

const commentsRouter = Router({ mergeParams: true });

commentsRouter.get(
  '/',
  verifyToken,
  validateArticleId,
  commentsController.commentsGetAll
);

commentsRouter.post(
  '/',
  verifyToken,
  authorizeRoles(['author', 'user']),
  validateArticleId,
  validateComment,
  commentsController.commentsCreate
);

commentsRouter.put(
  '/:commentId',
  verifyToken,
  validateArticleId,
  validateCommentId,
  authorizeRoles(['author', 'user']),
  validateCommentUpdate,
  commentsController.commentsUpdateById
);

commentsRouter.delete('/:commentId', commentsController.commentsDeleteById);

module.exports = commentsRouter;
