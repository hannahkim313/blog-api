const { logError } = require('./errorUtils');

const statusMessages = {
  200: 'OK',
  201: 'Resource created successfully',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'You do not have permission to access this resource',
  404: 'Resource not found',
  500: 'Internal Server Error',
};

const sendResponse = (res, status, data = {}) => {
  if (!statusMessages[status]) {
    logError(`Invalid status code: ${status}`);

    return res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }

  res.status(status).json({
    status,
    message: statusMessages[status],
    data,
  });
};

module.exports = sendResponse;
