const sendResponse = require('../utils/sendResponse');

const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return sendResponse(res, 403);
    }

    next();
  };
};

module.exports = authorizeRoles;
