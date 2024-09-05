const { Router } = require('express');
const commentsController = require('../controllers/commentsController');

const commentsRouter = Router();

commentsRouter.get('/', commentsController.commentsGetAll);
commentsRouter.post('/', commentsController.commentsCreate);
commentsRouter.put('/:commentId', commentsController.commentsUpdateById);
commentsRouter.delete('/:commentId', commentsController.commentsDeleteById);

module.exports = commentsRouter;
