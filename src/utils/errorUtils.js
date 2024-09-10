require('dotenv').config();

const logError = (message) => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(message);
  }
};

module.exports = { logError };
