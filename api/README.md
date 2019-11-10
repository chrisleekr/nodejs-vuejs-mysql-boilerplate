# API for Node.js + Vue.js boilerplate

## Routes

- [x] GET `/`
- [x] POST `/login`: Process login
- [x] POST `/register`: Register new user and send a confirmation email to the user
- [x] GET `/register-confirm`: Verify an email confirmation link and complete user registration, then redirect to the frontend page
- [x] POST `/password-reset-request`: Send an email which includes password reset link
- [x] POST `/password-reset-verify`: Verify a password reset link and redirect to the password reset page
- [x] POST `/password-reset`: Update new password
- [x] GET `/me`: Return login user's information
- [x] POST `/me`: Update login user's information
- [x] GET `/user`: Retrieve list of users
- [x] POST `/user`: Create new user
- [x] GET `/user/1`: Get user information
- [x] PATCH `/user/1`: Update user information
- [x] DEL `/user/1`: Delete user
- [ ] GET `/staff`: Retrieve list of staffs
- [ ] POST `/staff`: Create new staff
- [ ] GET `/staff/1`: Get staff information
- [ ] PATCH `/staff/1`: Update staff information
- [ ] DEL `/staff/1`: Delete staff information
- [ ] GET `/permissions`: Retrieve list of permissions

## Features

- Registration
- Confirm email address
- Reset password
- Login
- Manage login user information
- Manage staff (role=50)
- Manage user (role=1)
- Manage staff permission

## Roles

- Administrator: 99
- Staff: 50
- User: 1

## Todo

- [x] Add pagination to list
- [ ] Add Swagger
