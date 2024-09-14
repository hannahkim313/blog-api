const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const sendResponse = require('../utils/sendResponse');
const { logError } = require('../utils/errorUtils');

const authenticateUser = (strategy, options = {}) => {
  return (req, res, next) => {
    passport.authenticate(strategy, options, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        sendResponse(res, 401, { error: info.message });
      }

      jwt.sign(
        { id: user.id, role: user.role },
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
  };
};

module.exports = authenticateUser;
