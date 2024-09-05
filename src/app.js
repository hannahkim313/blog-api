require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const authRouter = require('./routes/authRouter');
const usersRouter = require('./routes/usersRouter');
const articlesRouter = require('./routes/articlesRouter');
const commentsRouter = require('./routes/commentsRouter');

const app = express();

app.set('views', __dirname);
app.set('view engine', 'ejs');

// Use middleware
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

// TODO: Define error-handling middleware

// Define the routes
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/articles/:articleId/comments', commentsRouter);

// Define the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
