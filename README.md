# Blog API

## Project Summary

This project, created by The Odin Project, is a RESTful blog API for managing articles, users, and comments with role-based authentication and input validation. The main objectives of this project include designing a scalable API architecture using models created with Prisma, routes, and controllers; managing data using PostgreSQL; authenticating protected routes using Passport.js and jsonwebtoken (JWT); and integrating the API to a front-end.

## Features Overview

- User authentication and authorization are handled through login and registration functionalities, with role-based assignment for access control.

- Data is managed using PostgreSQL and Prisma, simplifying database queries for efficient data handling.

- Routing is structured with separate routes for authentication, articles, and comments, keeping the API organized and maintainable.

- Security is enhanced by validating and sanitizing input data to prevent errors and malicious input.

- Error handling is centralized through middleware, ensuring consistent error responses and user-friendly messages.

## Demo

Check out the [live demo](https://hannahkim.dev/blog), which is featured as the blog section of my portfolio.

To see how the API was integrated to the front-end, check out the [source code](https://github.com/hannahkim313/dev-portfolio) to my portfolio.
