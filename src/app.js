require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

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

// TODO: Define the routes

// Define the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app listening on port ${PORT}!`));
