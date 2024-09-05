const { Router } = require('express');
const authController = require('../controllers/authController');

const authRouter = Router();

authRouter.get('/profile', authController.authProfile);
authRouter.post('/register', authController.authRegister);
authRouter.post('/login', authController.authLogin);
authRouter.post('/logout', authController.authLogout);

module.exports = authRouter;
