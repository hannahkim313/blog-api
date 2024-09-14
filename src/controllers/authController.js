require('dotenv').config();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prismaClient');
const { handleValidationErrors } = require('../utils/errorHelpers');
const sendResponse = require('../utils/sendResponse');

const authGetProfile = (req, res) => sendResponse(res, 200, { user: req.user });

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
      email: updatedUser.email,
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
