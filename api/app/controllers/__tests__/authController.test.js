const config = require('config');
const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');

const { app, server } = require('../../server');
const authModel = require('../../models/authModel');
const userModel = require('../../models/userModel');
const { getPool } = require('../../helpers/database');

describe('authController', () => {
  let request;
  let response;

  const frontendURL = config.get('frontendUrl');

  beforeAll(async () => {
    request = supertest(app);
  });

  afterAll(async () => {
    (await getPool()).end();
    server.close();
  });

  describe('login', () => {
    describe('when validation is failed', () => {
      beforeAll(async () => {
        response = await request.post('/user/login').send({});
      });

      it('returns expected status', () => {
        expect(response.status).toBe(422);
      });

      it('returns expected response', () => {
        expect(response.body).toStrictEqual({
          data: [
            {
              location: 'body',
              msg: 'Username must be provided.',
              param: 'username'
            },
            {
              location: 'body',
              msg: 'Password must be provided.',
              param: 'password'
            },
            {
              location: 'body',
              msg: 'Password should be at least 6 chars long.',
              param: 'password'
            }
          ],
          message: 'There are validation errors.',
          status: 422,
          success: false
        });
      });
    });

    describe('user', () => {
      describe('when login is failed', () => {
        beforeAll(async () => {
          authModel.login = jest.fn().mockImplementation(() => {
            throw new Error('something happened');
          });

          response = await request.post('/user/login').send({
            username: 'user',
            password: '123456'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            data: [
              {
                value: '',
                msg: 'something happened',
                param: 'general',
                location: 'body'
              }
            ],
            message: 'There is a validation error.',
            status: 422,
            success: false
          });
        });
      });

      describe('when login is succeed', () => {
        beforeAll(async () => {
          response = await request.post('/user/login').send({
            username: 'user',
            password: '123456'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(200);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            message: 'You are successfully logged in.',
            status: 200,
            success: true
          });
        });
      });
    });

    describe('staff', () => {
      describe('when login is failed', () => {
        beforeAll(async () => {
          authModel.login = jest.fn().mockImplementation(() => {
            throw new Error('something happened');
          });

          response = await request.post('/staff/login').send({
            username: 'staff',
            password: '123456'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            data: [
              {
                value: '',
                msg: 'something happened',
                param: 'general',
                location: 'body'
              }
            ],
            message: 'There is a validation error.',
            status: 422,
            success: false
          });
        });
      });

      describe('when login is succeed', () => {
        beforeAll(async () => {
          response = await request.post('/staff/login').send({
            username: 'staff',
            password: '123456'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(200);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            message: 'You are successfully logged in.',
            status: 200,
            success: true
          });
        });
      });
    });

    describe('admin', () => {
      describe('when login is succeed', () => {
        beforeAll(async () => {
          response = await request.post('/staff/login').send({
            username: 'admin',
            password: '123456'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(200);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            message: 'You are successfully logged in.',
            status: 200,
            success: true
          });
        });
      });
    });
  });

  describe('register', () => {
    describe('when validation is failed', () => {
      describe('when nothing passed', () => {
        beforeAll(async () => {
          response = await request.post('/user/register').send({});
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There are validation errors.',
            data: [
              {
                msg: 'Username must be provided.',
                param: 'username',
                location: 'body'
              },
              {
                msg: 'First name must be provided.',
                param: 'first_name',
                location: 'body'
              },
              {
                msg: 'First name must be provided.',
                param: 'last_name',
                location: 'body'
              },
              {
                msg: 'Password must be provided.',
                param: 'password',
                location: 'body'
              },
              {
                msg: 'Password should be at least 6 chars long.',
                param: 'password',
                location: 'body'
              },
              {
                msg: 'Email must be provided.',
                param: 'email',
                location: 'body'
              },
              {
                msg: 'Email must be valid. i.e. john@doe.com',
                param: 'email',
                location: 'body'
              }
            ]
          });
        });
      });

      describe('when username and email are already used', () => {
        beforeAll(async () => {
          userModel.getOne = jest.fn().mockResolvedValue({
            id: 10
          });

          response = await request.post('/user/register').send({
            username: 'chrislee',
            password: '123456',
            first_name: 'Chris',
            last_name: 'Doe',
            email: 'chris.lee@boilerplate.local'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There are validation errors.',
            data: [
              {
                msg: 'Username is already in use.',
                param: 'username',
                location: 'body',
                value: 'chrislee'
              },
              {
                msg: 'Email is already in use.',
                param: 'email',
                location: 'body',
                value: 'chris.lee@boilerplate.local'
              }
            ]
          });
        });
      });
    });

    describe('user', () => {
      describe('when register is failed', () => {
        beforeAll(async () => {
          authModel.register = jest.fn().mockImplementation(() => {
            throw new Error('something happened');
          });

          response = await request.post('/user/register').send({
            username: 'chrislee',
            password: '123456',
            first_name: 'Chris',
            last_name: 'Doe',
            email: 'chris.lee@boilerplate.local'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            data: [
              {
                value: '',
                msg: 'something happened',
                param: 'general',
                location: 'body'
              }
            ],
            message: 'There is a validation error.',
            status: 422,
            success: false
          });
        });
      });

      describe('when register is succeed', () => {
        beforeAll(async () => {
          response = await request.post('/user/register').send({
            username: uuidv4(),
            password: '123456',
            first_name: 'Chris',
            last_name: 'Doe',
            email: `${uuidv4()}@boilerplate.local`
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(200);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            message: 'You are successfully registered.',
            status: 200,
            success: true
          });
        });
      });
    });
  });

  describe('registerConfirm', () => {
    describe('when validation is failed', () => {
      describe('when nothing passed', () => {
        beforeAll(async () => {
          response = await request.get('/user/register-confirm');
        });

        it('triggers expected status', () => {
          expect(response.status).toBe(302);
        });

        it('triggers expected header', () => {
          expect(response.header.location).toBe(`${frontendURL}/login?messageKey=registerConfirmValidationError`);
        });
      });

      describe('when user is not found', () => {
        beforeAll(async () => {
          userModel.getOne = jest.fn().mockResolvedValue([]);
          response = await request.get('/user/register-confirm?key=invalid-key');
        });

        it('triggers expected status', () => {
          expect(response.status).toBe(302);
        });

        it('triggers expected header', () => {
          expect(response.header.location).toBe(`${frontendURL}/login?messageKey=registerConfirmValidationError`);
        });
      });
    });

    describe('when register confirmation is failed', () => {
      beforeAll(async () => {
        // Add test user
        userModel.getOne = jest.fn().mockResolvedValue({
          auth_key: 'valid-key'
        });

        authModel.registerConfirm = jest.fn().mockImplementation(() => {
          throw new Error('something happened');
        });

        response = await request.get(`/user/register-confirm?key=valid-key`);
      });

      it('triggers expected status', () => {
        expect(response.status).toBe(302);
      });

      it('triggers expected header', () => {
        expect(response.header.location).toBe(`${frontendURL}/login?messageKey=registerConfirmFailed`);
      });
    });

    describe('when register confirmation is succeed', () => {
      beforeAll(async () => {
        // Add test user
        userModel.getOne = jest.fn().mockResolvedValue({
          auth_key: 'valid-key'
        });

        authModel.registerConfirm = jest.fn();

        response = await request.get(`/user/register-confirm?key=valid-key`);
      });

      it('triggers expected status', () => {
        expect(response.status).toBe(302);
      });

      it('triggers expected header', () => {
        expect(response.header.location).toBe(`${frontendURL}/login?messageKey=registerConfirmSuccess`);
      });
    });
  });

  describe('passwordResetRequest', () => {
    describe('when validation is failed', () => {
      describe('when nothing passed', () => {
        beforeAll(async () => {
          response = await request.post('/user/password-reset-request');
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There are validation errors.',
            data: [
              {
                msg: 'Email must be provided.',
                param: 'email',
                location: 'body'
              },
              {
                msg: 'Email must be valid. i.e. john@doe.com',
                param: 'email',
                location: 'body'
              },
              {
                value: '@',
                msg: 'Email cannot be found.',
                param: 'email',
                location: 'body'
              }
            ]
          });
        });
      });

      describe('when email is empty string', () => {
        beforeAll(async () => {
          response = await request.post('/user/password-reset-request').send({
            email: ''
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There are validation errors.',
            data: [
              {
                msg: 'Email must be provided.',
                param: 'email',
                location: 'body',
                value: ''
              },
              {
                msg: 'Email must be valid. i.e. john@doe.com',
                param: 'email',
                location: 'body',
                value: ''
              },
              {
                value: '@',
                msg: 'Email cannot be found.',
                param: 'email',
                location: 'body'
              }
            ]
          });
        });
      });

      describe('when user is not found', () => {
        beforeAll(async () => {
          userModel.getOne = jest.fn().mockResolvedValue([]);
          response = await request.post('/user/password-reset-request').send({
            email: 'chris.lee@boilerplate.local'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There is a validation error.',
            data: [
              {
                value: 'chris.lee@boilerplate.local',
                msg: 'Email cannot be found.',
                param: 'email',
                location: 'body'
              }
            ]
          });
        });
      });
    });

    describe('when password reset request is failed', () => {
      beforeAll(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          id: 10
        });

        authModel.passwordResetRequest = jest.fn().mockImplementation(() => {
          throw new Error('something happened');
        });

        response = await request.post('/user/password-reset-request').send({
          email: 'chris.lee@boilerplate.local'
        });
      });

      it('returns expected status', () => {
        expect(response.status).toBe(422);
      });

      it('returns expected response', () => {
        expect(response.body).toStrictEqual({
          success: false,
          status: 422,
          message: 'There is a validation error.',
          data: [
            {
              value: '',
              msg: 'something happened',
              param: 'general',
              location: 'body'
            }
          ]
        });
      });
    });

    describe('when password reset request is succeed', () => {
      beforeAll(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          id: 10
        });

        authModel.passwordResetRequest = jest.fn().mockResolvedValue({
          result: true
        });

        response = await request.post('/user/password-reset-request').send({
          email: 'chris.lee@boilerplate.local'
        });
      });

      it('returns expected status', () => {
        expect(response.status).toBe(200);
      });

      it('returns expected response', () => {
        expect(response.body).toStrictEqual({
          success: true,
          status: 200,
          message:
            'Password reset request has been processed. Please check your email and follow the link to reset password.',
          data: {
            result: true
          }
        });
      });
    });
  });

  describe('passwordResetVerify', () => {
    describe('when validation is failed', () => {
      describe('when nothing passed', () => {
        beforeAll(async () => {
          response = await request.get('/user/password-reset-verify');
        });

        it('triggers expected status', () => {
          expect(response.status).toBe(302);
        });

        it('triggers expected header', () => {
          expect(response.header.location).toBe(
            `${frontendURL}/password-reset-request?messageKey=passwordResetValidationError`
          );
        });
      });

      describe('when key is undefined', () => {
        beforeAll(async () => {
          response = await request.get('/user/password-reset-verify?key=undefined');
        });

        it('triggers expected status', () => {
          expect(response.status).toBe(302);
        });

        it('triggers expected header', () => {
          expect(response.header.location).toBe(
            `${frontendURL}/password-reset-request?messageKey=passwordResetValidationError`
          );
        });
      });

      describe('when user is not found', () => {
        beforeAll(async () => {
          userModel.getOne = jest.fn().mockResolvedValue([]);
          response = await request.get('/user/password-reset-verify?key=invalid-key');
        });

        it('triggers expected status', () => {
          expect(response.status).toBe(302);
        });

        it('triggers expected header', () => {
          expect(response.header.location).toBe(
            `${frontendURL}/password-reset-request?messageKey=passwordResetValidationError`
          );
        });
      });
    });

    describe('when password reset verification is success', () => {
      beforeAll(async () => {
        // Add test user
        userModel.getOne = jest.fn().mockResolvedValue({
          auth_key: 'valid-key'
        });

        response = await request.get('/user/password-reset-verify?key=valid-key');
      });

      it('triggers expected status', () => {
        expect(response.status).toBe(302);
      });

      it('triggers expected header', () => {
        expect(response.header.location).toBe(
          `${frontendURL}/password-reset?messageKey=passwordResetTokenConfirmed&key=valid-key`
        );
      });
    });
  });

  describe('passwordReset', () => {
    describe('when validation is failed', () => {
      describe('when nothing passed', () => {
        beforeAll(async () => {
          response = await request.post('/user/password-reset');
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There are validation errors.',
            data: [
              {
                msg: 'Key must be provided.',
                param: 'key',
                location: 'body'
              },
              {
                msg: 'Password must be provided.',
                param: 'password',
                location: 'body'
              },
              {
                msg: 'Password should be at least 6 chars long.',
                param: 'password',
                location: 'body'
              }
            ]
          });
        });
      });

      describe('when user cannot be found', () => {
        beforeAll(async () => {
          userModel.getOne = jest.fn().mockResolvedValue([]);
          response = await request.post('/user/password-reset').send({
            key: 'invalid-key',
            password: 'new-password'
          });
        });

        it('returns expected status', () => {
          expect(response.status).toBe(422);
        });

        it('returns expected response', () => {
          expect(response.body).toStrictEqual({
            success: false,
            status: 422,
            message: 'There is a validation error.',
            data: [
              {
                msg: 'Key is invalid.',
                param: 'key',
                location: 'body',
                value: 'invalid-key'
              }
            ]
          });
        });
      });
    });

    describe('when password reset is failed', () => {
      beforeAll(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          id: 10
        });

        authModel.passwordReset = jest.fn().mockImplementation(() => {
          throw new Error('something happened');
        });

        response = await request.post('/user/password-reset').send({
          key: 'valid-key',
          password: 'new-password'
        });
      });

      it('returns expected status', () => {
        expect(response.status).toBe(422);
      });

      it('returns expected response', () => {
        expect(response.body).toStrictEqual({
          success: false,
          status: 422,
          message: 'There is a validation error.',
          data: [
            {
              value: '',
              msg: 'something happened',
              param: 'general',
              location: 'body'
            }
          ]
        });
      });
    });

    describe('when password reset is succeed', () => {
      beforeAll(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          id: 10
        });

        authModel.passwordReset = jest.fn().mockResolvedValue({
          result: true
        });

        response = await request.post('/user/password-reset').send({
          key: 'valid-key',
          password: 'new-password'
        });
      });

      it('returns expected status', () => {
        expect(response.status).toBe(200);
      });

      it('returns expected response', () => {
        expect(response.body).toStrictEqual({
          success: true,
          status: 200,
          message: 'Your password has been updated. Please login with your new password.',
          data: {
            result: true
          }
        });
      });
    });
  });
});
