const sendResponse = require('../utils/sendResponse');

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    req.token = bearerHeader.split(' ')[1];
    next();
  } else {
    sendResponse(res, 403);
  }
};

module.exports = verifyToken;
