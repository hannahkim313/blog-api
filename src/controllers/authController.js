require('dotenv').config();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prismaClient');
const { handleValidationErrors } = require('../utils/errorHelpers');
const sendResponse = require('../utils/sendResponse');

const authGetProfile = asyncHandler(async (req, res) => {
  const { id, role } = req.user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      username: true,
    },
  });

  sendResponse(res, 200, {
    user: {
      id,
      role,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
  });
});

const authUpdateProfile = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const { password, ...updatedData } = req.body;

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updatedData,
  });

  sendResponse(res, 200, {
    user: {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
    },
  });
});

const authDeleteProfile = asyncHandler(async (req, res) => {
  await prisma.user.delete({
    where: { id: req.user.id },
  });

  sendResponse(res, 204);
});

const authRegister = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const { firstName, lastName, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    },
  });

  sendResponse(res, 201, {
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
    },
  });
});

const authLogin = asyncHandler(async (req, res) => {
  if (handleValidationErrors(req, res, 401)) {
    return;
  }
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
