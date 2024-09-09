const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { logError, handleValidationErrors } = require('../utils/errorHelpers');

const prisma = new PrismaClient();

const authProfile = (req, res) => {
  res.send('not yet implemented');
};

const authRegister = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400, 'Bad Request')) {
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

  res.status(201).json({ status: 'User registered successfully' });
});

const authLogin = asyncHandler(async (req, res, next) => {
  if (handleValidationErrors(req, res, 401, 'Unauthorized')) {
    return;
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ error: info.message });
    }

    jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
      (err, token) => {
        if (err) {
          logError(err.message);

          return res
            .status(500)
            .json({ status: 500, message: 'Internal Server Error' });
        }

        res.status(200).json({ token });
      }
    );
  })(req, res, next);
});

const authLogout = (req, res) => {
  res.send('not yet implemented');
};

module.exports = {
  authProfile,
  authRegister,
  authLogin,
  authLogout,
};
