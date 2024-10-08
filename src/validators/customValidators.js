const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prismaClient');
const { handleCustomErrors } = require('../utils/errorHelpers');

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

const articleExists = async (title) => {
  try {
    const article = await prisma.article.findFirst({
      where: { title },
    });

    if (article) {
      throw new Error('An article with this title already exists.');
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
  articleExists,
};
