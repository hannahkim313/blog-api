const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { handleCustomErrors } = require('../utils/errorHelpers');

const prisma = new PrismaClient();

const checkUsernameExists = async (username) => {
  try {
    const exists = await prisma.user.findUnique({
      where: { username },
    });

    return !!exists;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

const usernameExists = async (username) => {
  try {
    const exists = await checkUsernameExists(username);

    if (exists) {
      throw new Error('Username is already taken');
    }

    return true;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

const emailExists = async (email) => {
  try {
    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new Error('Email is already registered');
    }

    return true;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

const passwordsMatch = (confirmPassword, { req }) => {
  return confirmPassword === req.body.password;
};

const isValidUsername = async (username) => {
  try {
    const exists = await checkUsernameExists(username);

    if (!exists) {
      throw new Error('Incorrect username');
    }

    return true;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

const isValidPassword = async (password, { req }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (!user) {
      throw new Error('Incorrect username');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    return true;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

module.exports = {
  usernameExists,
  emailExists,
  passwordsMatch,
  isValidUsername,
  isValidPassword,
};
