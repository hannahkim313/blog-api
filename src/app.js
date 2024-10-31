require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const authRouter = require('./routes/authRouter');
const articlesRouter = require('./routes/articlesRouter');
const commentsRouter = require('./routes/commentsRouter');
const sendResponse = require('./utils/sendResponse');
const { logError } = require('./utils/errorUtils');

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const message = `CORS policy does not allow access from ${origin}`;
      callback(new Error(message), false);
    }
  },
  methods: 'GET,PUT,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again later.',
});
app.use(limiter);

// Session and Passport initialization
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use('/api/auth', authRouter);
app.use('/api/articles', articlesRouter);
app.use('/api/articles/:articleId/comments', commentsRouter);

// Error-handling middleware
app.use((err, req, res, next) => {
  logError(err.stack);
  sendResponse(res, 500);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
