<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Run the following command to install the required packages:

## 1. Project setup

```bash
$ npm install
```

## 2. Configure Environment Variables

```bash
# Copy the example.env file to a new file named .env and update the values in .env to match your local database setup:

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database

```

## 3. Create Database

```bash

# Ensure your database server is running and create the database specified in the .env file.

```

# 4. Start the Development Server

```bash

# Run the following command to start the server in development mode:

$ npm run start:dev

# API Endpoints

# The following endpoints are available in the application. Use appropriate HTTP methods (e.g., GET, POST, DELETE) to interact with them.

1. User

Post http://localhost:3000/users/signin - Log in a user.

Post http://localhost:3000/users/register - Register a new user.

Get  http://localhost:3000/users/get - Get user details

Patch http://localhost:3000/users/update - Update user information.

2. Post

POST http://localhost:3000/post/create - Create a new post.

GET http://localhost:3000/post/me - Get all posts created by the current user.

GET http://localhost:3000/post/friends/{UserId} - Get post based on userId.

Delete http://localhost:3000/post/{postId} - Delete post

4. Friend Requests

POST http://localhost:3000/friend-request/send - Send a friend request.

PUT http://localhost:3000/friend-request/{requestId} - Update friend-request status.

GET http://localhost:3000/friend-request/requests - Get all pending friend requests for the current user.

5. Comments

POST http://localhost:3000/comment/create/{postId} - Add a comment to a post.

GET http://localhost:3000/comment/{postId} - Get all comments for a specific post.

DELETE http://localhost:3000/comment/delete/{commentId} - Delete a comment by its ID.

6. Likes

POST http://localhost:3000/like/{postId} - Like a post.

POST http://localhost:3000/like/unlike/{postId} - Unlike a post.

GET http://localhost:3000/like/count/{postId} - Get the total number of likes for a specific post.

```

# 5. Swagger Integration
```bash

#The application is integrated with Swagger for API documentation.

Swagger URL: http://localhost:3000/api

Notes

# Ensure your .env file is correctly configured before running the application.

# Update the Bearer token before testing protected APIs.

# Use tools like Postman, curl, or Swagger UI to test API endpoints during development.

```

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
