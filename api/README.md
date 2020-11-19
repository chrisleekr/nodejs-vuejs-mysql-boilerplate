# API for Node.js + Vue.js boilerplate

Node.js, Express, Webpack, Express Validator, JWT, Bunyan, Promise MySQL, Node Mailer, Jest, Supertest, Nodemon, DB Migrate

## How to start development

1. Install npm packages

   ```bash
   npm install
   ```

2. Uncomment **volumes** in the `docker-compose.yml` file
3. Access via `http://localhost/api`

## How to manage migration

[https://db-migrate.readthedocs.io/en/latest/](https://db-migrate.readthedocs.io/en/latest/)

## Routes

- GET `/`
- Frontend
  - POST `/user/login`: Process user login
  - POST `/user/register`: Register new user and send a confirmation email to the user
  - GET `/user/register-confirm`: Verify an email confirmation link and complete user registration, then redirect to the frontend page
  - POST `/user/password-reset-request`: Send an email which includes password reset link
  - POST `/user/password-reset-verify`: Verify a password reset link and redirect to the password reset page
  - POST `/user/password-reset`: Update new password
  - GET `/me`: Return login user's information
  - POST `/me`: Update login user's information
- Backend
  - POST `/staff/login`: Process staff login
  - GET `/user`: Retrieve list of users
  - POST `/user`: Create new user
  - GET `/user/1`: Get user information
  - PATCH `/user/1`: Update user information
  - DELETE `/user/1`: Delete user
  - GET `/staff`: Retrieve list of staffs
  - POST `/staff`: Create new staff
  - GET `/staff/1`: Get staff information
  - PATCH `/staff/1`: Update staff information
  - DELETE `/staff/1`: Delete staff information
  - GET `/permission`: Retrieve list of permissions
  - GET `/setting`: Retrieve list of settings
  - POST `/setting`: Create new setting
  - GET `/setting/1`: Get setting information
  - PATCH `/setting/1`: Update setting information
  - DELETE `/setting/1`: Delete setting information

## Features

- Database migration
- Frontend
  - User registration
  - Confirm user's email address
  - Reset user's password
  - User login/logout
- Backend
  - Staff Login/Logout
  - Permission based routes
  - Manage login user information
  - Manage staff (role>=50) with permission
  - Manage user (role=1)
  - Manage settings

## Roles

- Administrator: 99
- Staff: 50
- User: 1

## Todo

- [x] Add pagination to list
- [x] Unit test
- [ ] E2E test
- [ ] File uploader
- [ ] Add Swagger
