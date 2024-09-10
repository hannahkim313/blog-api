const { Router } = require('express');
const authController = require('../controllers/authController');
const validateRegister = require('../validators/registerValidators');
const validateLogin = require('../validators/loginValidators');
const verifyToken = require('../middleware/verifyToken');

const authRouter = Router();

authRouter.get('/profile', verifyToken, authController.authProfile);

authRouter.post('/register', validateRegister, authController.authRegister);

authRouter.post('/login', validateLogin, authController.authLogin);

authRouter.post('/logout', authController.authLogout);

module.exports = authRouter;
