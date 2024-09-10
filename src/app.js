require('dotenv').config();
const express = require('express');
const session = require('express-session');
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

// Use middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use('/auth', authRouter);
app.use('/articles', articlesRouter);
app.use('/articles/:articleId/comments', commentsRouter);

// User error-handling middleware
app.use((err, req, res, next) => {
  logError(err.stack);
  sendResponse(res, 500);
});

// Define the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}!`));
