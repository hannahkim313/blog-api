const { Router } = require('express');
const usersController = require('../controllers/usersController');

const usersRouter = Router();

usersRouter.get('/:userId', usersController.usersGetById);
usersRouter.put('/:userId', usersController.usersUpdateById);
usersRouter.delete('/:userId', usersController.usersDeleteById);

module.exports = usersRouter;
