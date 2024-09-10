require('dotenv').config();
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { handleValidationErrors } = require('../utils/errorHelpers');
const { logError } = require('../utils/errorUtils');
const sendResponse = require('../utils/sendResponse');

const prisma = new PrismaClient();

const authGetProfile = (req, res) => sendResponse(res, 200, { user: req.user });

const authUpdateProfile = (req, res) => {
  // do something
};

const authDeleteProfile = (req, res) => {
  // do something
};

const authRegister = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const { firstName, lastName, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    },
  });

  sendResponse(res, 201);
});

const authLogin = asyncHandler(async (req, res, next) => {
  if (handleValidationErrors(req, res, 401)) {
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      sendResponse(res, 401, { error: info.message });
    }

    jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
      (err, token) => {
        if (err) {
          logError(err.message);

          return sendResponse(res, 500);
        }

        sendResponse(res, 200, { token });
      }
    );
  })(req, res, next);
});

const authLogout = (req, res) => sendResponse(res, 200);

module.exports = {
  authGetProfile,
  authUpdateProfile,
  authDeleteProfile,
  authRegister,
  authLogin,
  authLogout,
};
