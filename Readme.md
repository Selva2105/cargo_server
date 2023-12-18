# CarGo

## Overview

CarGo is an application designed for pre-booking parking slots. You might wonder, "Why pre-book parking slots?" In today's modern world, where car ownership is prevalent, spending time searching for parking spaces when going out with family or friends can be inconvenient. CarGo offers a solution by allowing users to pre-book parking slots, ensuring a convenient and enjoyable outing without the hassle of searching for parking spots on arrival.

## Table of Contents

- [Setup Instructions](#setup-instructions)
- [Architecture](#architecture)
- [Endpoints and Routes](#endpoints-and-routes)
- [Database Schema](#database-schema)
- [Middleware and Error Handling](#middleware-and-error-handling)
- [Authentication and Authorization](#authentication-and-authorization)
- [Third-Party Libraries and Packages](#third-party-libraries-and-packages)
- [Testing Procedures](#testing-procedures)
- [Deployment](#deployment)
- [Troubleshooting and FAQs](#troubleshooting-and-faqs)
- [Contributing Guidelines](#contributing-guidelines)

## Setup Instructions

- Install Node.js and MongoDB.
- Clone the repository from GitHub.
- Install dependencies using `npm install`.
- Set up environment variables (if applicable).
- Start the server using `npm start`.

## Architecture

- MVC (Model-View-Controller) architecture.
- Node.js for server-side logic.
- Express.js for routing and middleware.
- MongoDB for the database.

## Endpoints and Routes

### Authentication

- **POST** `/api/v1/auth/signup` (Create new user)
- **POST** `/api/v1/auth/signin` (Login the user)
- **POST** `/api/v1/auth/user/verify/:token` (Verify the user from the email link)
- **POST** `/api/v1/auth/forgotPassword` (Forgot password link will be sent to the user email)
- **POST** `/api/v1/auth/resetPassword/:token` (Verify the link and reset the user password)

### User

- **GET** `/api/v1/user` (Get all users)
- **GET** `/api/v1/user/:id` (Get user by Id)
- **PATCH** `/api/v1/user/:id` (Update user by Id)
- **DELETE** `/api/v1/user/:id` (Delete user by Id)

### Auth

- **POST** `/api/v1/auth/signup` (Create user)
- **POST** `/api/v1/auth/signin` (Login user)
- **POST** `/api/v1/auth/user/verify/:token` (Verify the user)
- **POST** `/api/v1/auth/forgotPassword` (Send the token to user)
- **PATCH** `/api/v1/auth/resetPassword/:token` (Verify the token of the user and update the password)

### Parking

- **GET** `/api/v1/parking/getFilteredCollections` (Get the data {includes: filter,sort,pagenation})
- **POST** `/api/v1/parking/` (Create new parking)
- **PATCH** `/api/v1/parking/:id` (Update the parking details)
- **DELETE** `/api/v1/parking/:id` (Delete the parking details)

## Database Schema

### User Collection

- **\_id**: ObjectId
- **email**: String
- **phoneNumber**: String
- **dob**: Date
- **role**: String
- **password**: String
- **confirmPassword**: String
- **verified**: Boolean
- **passwordChangedAt**: Date
- **passwordResetToken**: String
- **passwordResetTokenExpire**: Date

## Middleware and Error Handling

- Authentication middleware for protecting routes.
- Error handling middleware for handling exceptions.
- Global Error handling middleware for sending errors in different env both in dev and production.
- Custom middleware for logging.

## Authentication and Authorization

- JWT (JSON Web Tokens) for user authentication.
- Authorization using role-based access control (Admin, User).

## Third-Party Libraries and Packages

- Express.js: For web application framework.
- Mongoose: MongoDB object modeling for Node.js.
- Bcrypt.js: For password hashing.
- JSONwebtoken: For generating and verifying JWTs.
- cors: For protecting unauthorized user to access routes.
- nodemailer: For sending mail for the user.
- validator: For validating user input.

## Testing Procedures

... (Instructions for testing and test suites)

## Deployment

... (Instructions for deployment)

## Troubleshooting and FAQs

- Issue: Server not starting.
  => Solution: Check MongoDB connection and correct environment variables.

## Contributing Guidelines

- Fork the repository and create a pull request for contributions.
- Follow coding standards and guidelines.

---
