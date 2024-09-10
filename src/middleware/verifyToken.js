require('dotenv').config();
const jwt = require('jsonwebtoken');
const { logError } = require('../utils/errorUtils');
const sendResponse = require('../utils/sendResponse');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];

  if (!token) {
    logError('Token required');

    return sendResponse(res, 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      logError('Invalid token');

      return sendResponse(res, 403);
    }

    req.user = user;
    next();
  });
};

module.exports = verifyToken;
