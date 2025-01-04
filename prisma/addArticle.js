const prisma = require('./prismaClient');

async function addArticle(title, description, content, isPublished, url) {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        authorId: 1,
        description,
        content,
        isPublished,
        url,
      },
    });

    console.log('Inserted article:', newArticle);
  } catch (error) {
    console.error('Error inserting article:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addArticle(
  'Building a Blog API with Node.js and Express',
  `
  In this article, I walk through creating a structured API from the ground up.
  You will learn about my organization process, including setting up routes,
  using middleware, and adding validations for secure and valid data management.
  `,
  `
  <section>
    <h2>Introduction</h2>
    <p>
      Working with APIs is a crucial skill in web development, one that
      quickly becomes second nature for frontend developers. In order for our
      applications to properly retrieve and interact with data from backend
      servers, we must manage APIs effectively to create responsive user
      experiences. Both my
      <a href="https://github.com/hannahkim313/shopping-cart"
        >Mock E-Commerce Store</a
      >
      and
      <a href="https://github.com/hannahkim313/memory-card"
        >Memory Card Game</a
      >
      showcase my ability to work with APIs in different contexts. For my most
      recent project, however, I wanted to challenge myself further by
      building a RESTful blog API from scratch.
    </p>
    <p>
      In this article, I will go over how I developed a simple blog API using
      Node.js and Express. The goal of this project was to create a backend
      that allows for creating, reading, updating, and deleting (CRUD) of blog
      posts while also handling key API requirements like error handling and
      validation. Through this project, I gained valuable experience in
      backend development, which has deepened my understanding of how APIs
      function and how they can enhance my work as a frontend developer.
    </p>
  </section>
  <section>
    <h2>Project Setup and Tools</h2>
    <p>
      This blog API is designed with the intention of having only one author
      (myself), which is ideal for developers looking to integrate a personal
      blog into their web applications. As a result, user role assignment
      during registration does not involve any checks. New users are assigned
      the role
      <code>user</code> by default. The only way to assign the
      <code>author</code> role is by hardcoding a new user into the database
      with that role. To simplify this process, a <code>seed.js</code> file
      was created, allowing you to assign yourself the
      <code>author</code> role using environment variables.
    </p>
    <p>
      Keeping the previously mentioned design in mind, here is an outline of
      the key tools and packages used in this project:
    </p>
    <ul>
      <li>
        <strong>Node.js</strong
        >: For creating routes and handling requests.
      </li>
      <li>
        <strong>PostgreSQL</strong
        >: For database management.
      </li>
      <li>
        <strong>Prisma</strong
        >: For simplifying database queries with an ORM.
      </li>
      <li>
        <strong>Passport.js</strong> and
        <strong><code>jsonwebtoken</code></strong
        >: For authenticating and authorizing users.
      </li>
      <li>
        <strong><code>bcryptjs</code></strong
        >: For securely hashing and storing passwords.
      </li>
      <li>
        <strong><code>cors</code></strong
        >: For controlling access to resources from different domains.
      </li>
      <li>
        <strong><code>express-validator</code></strong
        >: For validating and sanitizing incoming requests.
      </li>
      <li>
        <strong><code>dotenv</code></strong
        >: For managing environment variables securely.
      </li>
      <li>
        <strong>Postman</strong
        >: For testing API endpoints throughout the development process.
      </li>
    </ul>
  </section>
  <section>
    <h2>Defining the Models</h2>
    <p>
      The first step in creating a simple blog API was to define the necessary
      models for the database. Most blogs typically feature readers, blog
      posts, and often a commenting system. To capture these fundamental
      elements, I determined three models that would provide a solid
      foundation for the API:
      <strong>User</strong>, <strong>Article</strong>, and
      <strong>Comment</strong>.
    </p>
    <p>The schemas for each model are outlined below:</p>
    <pre>
      <code>
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
  url      = env("DATABASE_URL_PROD")
}

// Define user roles
enum Role {
  author
  user
}

// User model definition
model User {
  id        Int       @id @default(autoincrement())
  firstName String    @db.VarChar(50)
  lastName  String    @db.VarChar(50)
  username  String    @unique
  email     String    @unique
  password  String    @db.VarChar(255)
  role      Role      @default(user)
  articles  Article[]
  comments  Comment[]

  @@map("users")
}

// Article model definition
model Article {
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(255)
  description String    @db.VarChar(255)
  content     String
  author      User      @relation(fields: [authorId], references: [id])
  authorId    Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  isPublished Boolean   @default(false)
  url         String    @db.VarChar(255)
  comments    Comment[]

  @@map("articles")
}

// Comment model definition
model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  article   Article  @relation(fields: [articleId], references: [id])
  articleId Int
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime @default(now())

  @@map("comments")
}
    </code>
  </pre>
    <h3>Key Components</h3>
    <p>
      Each model contains an <code>id</code> field, which serves as a primary
      key and is automatically incremented for each new entry in the database.
      The <code>@@map</code> attribute allows us to define the table name for
      each model in the database rather than relying on Prisma's default
      naming conventions. This explicit mapping ensures consistency and avoids
      potential conflicts with PostgreSQL's reserved keywords.
    </p>
    <h3>Enum Usage</h3>
    <p>
      In the User model, the <code>role</code> field uses the
      <code>Role</code> enum to categorize users as either authors or regular
      users with a default value of <code>user</code>. This field is important
      for authorizing users in specific requests, such as distinguishing
      between users who can create articles and those who cannot.
    </p>
    <h3>Relationships</h3>
    <p>
      The <code>@relation</code> attribute defines the relationships between
      models by linking fields across models. For example, in the
      <strong>Article</strong> model, a user's <code>id</code> is linked to an
      article's <code>authorId</code>, establishing the user as the author of
      that article. Similarly, in the <strong>Comment</strong> model, each
      comment links to both an article and a user, allowing us to track which
      user commented on which article.
    </p>
  </section>
  <section>
    <h2>Structuring the Application</h2>
    <p>
      Before diving into the details of the routes and controllers, it is
      helpful to understand how the API is structured. The
      <code>app.js</code> file serves as the entry point for the application
      where all routes, middleware, and configurations come together. Here is
      the set up:
    </p>
    <pre>
      <code>
// app.js

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
      const message = CORS policy does not allow access from $${'origin'};
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
app.listen(PORT, () => console.log(Server running on port $${'PORT'}!));
      </code>
    </pre>
    <h3>Application-Level Middleware</h3>
    <p>
      <code>cors</code> is used to enhance security and enable cross-origin
      resource sharing from allowed origins through the
      <code>ALLOWED_ORIGINS</code> environment variable. The
      <code>express.json()</code> middleware is used to parse incoming JSON
      requests.
    </p>
    <h3>Route Definitions</h3>
    <p>
      The API routes for authentication (<code>/api/auth</code>), articles
      (<code>/api/articles</code>), and comments
      (<code>/api/articles/:articleId/comments</code>) are registered, linking
      to their respective routes. I will go into detail about how the routes
      are structured in the following section.
    </p>
    <h3>Error Handling</h3>
    <p>
      A simple error-handling middleware is included at the end of the
      application to catch and respond to any errors that occur during API
      requests. The <code>logError()</code> utility function logs errors to
      the console only if <code>NODE_ENV</code> is set to
      <code>development</code>, preventing sensitive error information from
      being exposed to users.
    </p>
  </section>
  <section>
    <h2>Setting Up Routes</h2>
    <p>
      After defining the <strong>User</strong>, <strong>Article</strong>, and
      <strong>Comment</strong> models and laying the foundation of the API, I
      set up three main Express routers: <code>authRouter</code>,
      <code>articlesRouter</code>, and <code>commentsRouter</code>. Each
      router handles the authentication, articles, and comments feature of the
      API, respectively, using controllers to process incoming requests and
      middlewares to promote security and validation. I will go through the
      structure of one of these routers, focusing on how routes, middleware,
      and controller functions are organized.
    </p>
    <section>
      <h3>Example: Authentication Routes</h3>
      <p>
        The <code>authRouter</code> manages routes related to user
        registration, login, logout, and profile management. The structure
        looks like this:
      </p>
      <pre>
      <code>
// authRouter.js

const { Router } = require('express');
const authController = require('../controllers/authController');
const {
  validateUserCreation,
  validateUserUpdate,
} = require('../validators/userValidators');
const validateLogin = require('../validators/loginValidators');
const verifyToken = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const authenticateUser = require('../middleware/authenticateUser');

const authRouter = Router();

// Get the user's profile information
authRouter.get(
  '/profile',
  verifyToken,
  authorizeRoles(['author', 'user']),
  authController.authGetProfile
);

// Update the user's profile information
authRouter.put(
  '/profile',
  verifyToken,
  authorizeRoles(['author', 'user']),
  validateUserUpdate,
  authController.authUpdateProfile
);

// Delete a user's profile information
authRouter.delete(
  '/profile',
  verifyToken,
  authorizeRoles(['author', 'user']),
  authController.authDeleteProfile
);

// Register a new user
authRouter.post('/register', validateUserCreation, authController.authRegister);

// Log a user in
authRouter.post(
  '/login',
  validateLogin,
  authenticateUser('local'),
  authController.authLogin
);

// Log a user out
authRouter.post('/logout', authController.authLogout);

module.exports = authRouter;
      </code>
    </pre>
      <h4>Route Structure</h4>
      <p>
        The <code>authRouter</code> manages user-related routes, such as
        registration (<code>/register</code>), login (<code>/login</code>),
        logout (<code>/logout</code>), and profile management (<code
          >/profile</code
        >
        for <code>GET</code>, <code>PUT</code>, and
        <code>DELETE</code> requests).
      </p>
      <p>Each route follows this general structure:</p>
      <pre>
      <code>
authRouter.METHOD('/some-path', middleware, authController.someFunction);
      </code>
    </pre>
      <p>
        For example, consider the <code>POST</code> route for the
        <code>/login</code> endpoint:
      </p>
      <pre>
      <code>
authRouter.post(
  '/login',
  validateLogin,
  authenticateUser('local'),
  authController.authLogin
);
      </code>
    </pre>
      <p>
        In this case, a <code>POST</code> route is defined on
        <code>authRouter</code> for the endpoint <code>/login</code> (note:
        the full endpoint is <code>/api/auth/login</code> as the prefix
        <code>/api/auth</code> was defined for <code>authRouter</code> in
        <code>app.js</code>). This route applies two middleware functions,
        <code>validateLogin</code> and <code>authenticateUser</code>, before
        calling the controller function
        <code>authController.authLogin</code> to complete the request.
      </p>
      <h4>Route-Level Middleware</h4>
      <p>
        Middleware functions are called between a request and a response to
        modify requests before the controller function processes the final
        logic and sends a response. The order in which middleware functions
        are called is crucial for controlling the flow of request handling.
      </p>
      <p>
        Using the same example from above, here is the <code>POST</code> route
        for the <code>/login</code> endpoint:
      </p>
      <pre>
      <code>
authRouter.post(
  '/login',
  validateLogin,
  authenticateUser('local'),
  authController.authLogin
);
      </code>
    </pre>
      <p>
        Here, <code>validateLogin</code> first checks that the request data is
        valid before <code>authenticateUser</code> attempts to authenticate
        the user using a local strategy (via Passport.js) securely. Only after
        passing through these middlewares does the request reach
        <code>authController.authLogin</code>, which logs the user in and
        sends a response accordingly.
      </p>
      <p>
        It is essential that any data passed to
        <code>authenticateUser</code> is valid. Without this validation, the
        application becomes more susceptible to security vulnerabilities such
        as SQL injection.
      </p>
      <p>
        If an error occurs at any point, it propagates through the middleware
        chain and eventually reaches the main error-handling middleware
        defined in <code>app.js</code>. This process, known as
        <strong>error propagation</strong>, allows for consistent error
        handling across the entire API.
      </p>
      <h4>Validators</h4>
      <p>
        Validators like <code>validateUserCreation</code> and
        <code>validateLogin</code> are middleware functions that ensure the
        data provided by the user is properly validated and sanitized before
        proceeding to the next middleware or controller function. For this
        blog API, a combination of default validators from
        <code>express-validator</code> and custom validators are used to
        streamline the validation process and provide clear error messages
        when validation fails.
      </p>
      <p>
        First, here are the custom validators used to validate a user's login
        credentials:
      </p>
      <pre>
      <code>
// customValidators.js

const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prismaClient');
const { handleCustomErrors } = require('../utils/errorHelpers');

// Checks if the username exists in the database
const checkUsernameExists = async (username) => {
  try {
    const exists = await prisma.user.findUnique({
      where: { username },
    });

    return !!exists;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

// Validates that the username is not already taken
const isValidUsername = async (username) => {
  try {
    const exists = await checkUsernameExists(username);

    if (!exists) {
      throw new Error('Incorrect username');
    }

    return true;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

// Validates that the password matches the hashed password in the database for a specific username
const isValidPassword = async (password, { req }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (!user) {
      throw new Error('Incorrect username');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    return true;
  } catch (err) {
    return handleCustomErrors(err);
  }
};

module.exports = {
  isValidUsername,
  isValidPassword,
};
      </code>
    </pre>
      <p>
        Using the custom validators, the <code>username</code> and
        <code>password</code> fields are validated and sanitized:
      </p>
      <pre>
      <code>
// loginValidators.js

const { body } = require('express-validator');
const {
  isValidUsername,
  isValidPassword,
} = require('../validators/customValidators');

// Validates and sanitizes each field for the login request body
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .custom(isValidUsername),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required.')
    .custom(isValidPassword),
];

module.exports = validateLogin;
      </code>
    </pre>
      <p>
        By combining <code>express-validator</code>'s built-in methods with
        custom validation logic, this process confirms that only valid, secure
        data reaches the controller functions. It reduces the risk of
        malicious inputs from entering the API and provides consistent error
        handling.
      </p>
    </section>
  </section>
  <section>
    <h2>Setting Up Controllers</h2>
    <p>
      Controller functions handle the core logic of each route after the
      request passes through middleware. They perform operations such as
      processing requests, interacting with the database, and sending
      appropriate responses. In <code>authRouter</code>, these
      responsibilities are managed by <code>authController</code>, which
      contains functions for user-related operations like registration, login,
      logout, and profile management.
    </p>
    <section>
      <h3>Example: Authentication Controller</h3>
      <p>
        The <code>authController</code> includes functions for various user
        operations:
      </p>
      <pre>
        <code>
// authController.js

require('dotenv').config();
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prismaClient');
const { handleValidationErrors } = require('../utils/errorHelpers');
const sendResponse = require('../utils/sendResponse');

// Get the user's profile information
const authGetProfile = asyncHandler(async (req, res) => {
  const { id, role } = req.user;

  // Retrieve specific user details from the database based on the user ID
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      username: true,
    },
  });

  // Send a 200 JSON response along with specific user details
  sendResponse(res, 200, {
    user: {
      id,
      role,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
  });
});

// Update the user's profile information
const authUpdateProfile = asyncHandler(async (req, res) => {
  // If there are validation errors, send a 400 JSON response
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const { password, ...updatedData } = req.body;

  // Hash the new password if provided in the request body
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updatedData.password = hashedPassword;
  }

  // Update specific user details from the database based on the user ID
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updatedData,
  });

  // Send a 200 JSON response along with the updated user details
  sendResponse(res, 200, {
    user: {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      username: updatedUser.username,
    },
  });
});

// Delete a user's profile information
const authDeleteProfile = asyncHandler(async (req, res) => {
  // Remove a specific user from the database based on the user ID
  await prisma.user.delete({
    where: { id: req.user.id },
  });

  sendResponse(res, 204);
});

// Register a new user
const authRegister = asyncHandler(async (req, res) => {
  // If there are validation errors, send a 400 JSON response
  if (handleValidationErrors(req, res, 400)) {
    return;
  }

  const { firstName, lastName, email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user into the database with the fields from the request body
  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    },
  });

  // Send a 201 JSON response along with specific user details
  sendResponse(res, 201, {
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username,
    },
  });
});

// Log a user in
const authLogin = asyncHandler(async (req, res) => {
  // If there are validation errors, send a 401 JSON response
  if (handleValidationErrors(req, res, 401)) {
    return;
  }

  sendResponse(res, 200);
});

// Log a user out
const authLogout = (req, res) => sendResponse(res, 200);

module.exports = {
  authGetProfile,
  authUpdateProfile,
  authDeleteProfile,
  authRegister,
  authLogin,
  authLogout,
};
        </code>
      </pre>
      <h3>Error Handling with <code>handleValidationErrors</code></h3>
      <p>
        The <code>handleValidationErrors</code> function is designed to catch
        and handle any validation errors passed along from previous middleware
        functions. When invoked, it checks for validation errors in the
        request and, if found, logs them to the console (when
        <code>NODE_ENV</code> is set to <code>development</code>). The
        function then sends a JSON response with the specified status code,
        preventing the request from continuing to the controller logic when
        invalid data is present. This ensures a consistent response structure
        for validation errors and helps maintain security by catching issues
        early in the request flow.
      </p>
      <pre>
        <code>
// errorHelpers.js

const { validationResult } = require('express-validator');
const { logError } = require('../utils/errorUtils');
const sendResponse = require('./sendResponse');

const handleValidationErrors = (req, res, status) => {
  // Extract the validation errors from a request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    logError(errorMessages);
    sendResponse(res, status);

    return true;
  }

  return false;
};

const handleCustomErrors = (err) => {
  logError('A validation error occurred');

  throw new Error(err.message);
};

module.exports = {
  handleValidationErrors,
  handleCustomErrors,
};
        </code>
      </pre>
      <h3>Database Operations Using Prisma</h3>
      <p>
        Database interactions in <code>authController</code> are powered by
        Prisma, which provides an ORM for handling database queries in a
        structured way. Most functions within
        <code>authController</code> focus on checking data existence (e.g.,
        retrieving a user profile by ID) or modifying data (e.g., updating
        profile information). This approach takes advantage of Prisma's
        methods, such as <code>findUnique</code>, <code>update</code>,
        <code>delete</code>, and <code>create</code>, to maintain code
        readability while simplifying database interactions.
      </p>
      <h3>Sending Responses with <code>sendResponse</code></h3>
      <p>
        The <code>sendResponse</code> utility function centralizes and
        standardizes JSON responses sent to the client. It takes three
        arguments: the response object, a status code, and any additional data
        to include in the JSON response. By managing responses through
        <code>sendResponse</code>, the application maintains a consistent
        format across all responses.
      </p>
      <p>
        For example, <code>authGetProfile</code> uses
        <code>sendResponse</code> to send a <code>200</code> status code along
        with user profile data, while <code>authLogout</code> sends a simple
        <code>200</code> success status:
      </p>
      <pre>
        <code>
const authGetProfile = asyncHandler(async (req, res) => {
  const { id, role } = req.user;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      username: true,
    },
  });

  sendResponse(res, 200, {
    user: {
      id,
      role,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
    },
  });
});

const authLogout = (req, res) => sendResponse(res, 200);
        </code>
      </pre>
    </section>
  </section>
  <section>
    <h2>Conclusion</h2>
    <p>
      This blog API demonstrates a basic yet fully functional setup for
      managing blog posts, users, and comments. Through an organized approach
      of routes, middlewares, and controller functions, the API provides a
      scalable foundation for blog management. In addition, implementing key
      tools and packages for authentication, authorization, error handling,
      and validation add to the API's level of security and maintainability.
    </p>
    <p>
      Although this API is currently designed for a single-author environment,
      its architecture allows for easy expansion and adaptability to more
      complex use cases. Its modular structure makes it possible to
      incorporate additional features, such as multi-author support, without
      compromising existing core functionalities.
    </p>
    <p>
      This project has deepened my understanding of building APIs with Node.js
      and Express, enhancing my skills and providing a fresh perspective of
      integrating APIs on the frontend. I also gained experience in backend
      development, significantly contributing to my journey of becoming an
      all-around software engineer.
    </p>
    <p>
      To explore the full source code of this project and learn how to
      implement the API into web applications, visit the project's
      <a href="https://github.com/hannahkim313/blog-api">GitHub repository</a
      >.
    </p>
  </section>
  `,
  true,
  'building-a-blog-api'
);
