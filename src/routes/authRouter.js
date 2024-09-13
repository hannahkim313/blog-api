const { Router } = require('express');
const authController = require('../controllers/authController');
const {
  validateUserCreation,
  validateUserUpdate,
} = require('../validators/userValidators');
const validateLogin = require('../validators/loginValidators');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

const authRouter = Router();

authRouter.get(
  '/profile',
  verifyToken,
  authorizeRoles(['author', 'user']),
  authController.authGetProfile
);

authRouter.put(
  '/profile',
  verifyToken,
  authorizeRoles(['author', 'user']),
  validateUserUpdate,
  authController.authUpdateProfile
);

authRouter.delete(
  '/profile',
  verifyToken,
  authorizeRoles(['author', 'user']),
  authController.authDeleteProfile
);

authRouter.post('/register', validateUserCreation, authController.authRegister);

authRouter.post('/login', validateLogin, authController.authLogin);

authRouter.post('/logout', authController.authLogout);

module.exports = authRouter;
