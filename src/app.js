require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
require('./config/passport');
const authRouter = require('./routes/authRouter');
const articlesRouter = require('./routes/articlesRouter');
const commentsRouter = require('./routes/commentsRouter');
const sendResponse = require('./utils/sendResponse');
const { logError } = require('./utils/errorUtils');

const app = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Define the routes
app.use('/blog/auth', authRouter);
app.use('/blog/articles', articlesRouter);
app.use('/blog/articles/:articleId/comments', commentsRouter);

// User error-handling middleware
app.use((err, req, res, next) => {
  logError(err.stack);
  sendResponse(res, 500);
});

// Define the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
