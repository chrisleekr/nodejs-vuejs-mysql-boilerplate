jest.mock('../../helpers/logger', () => ({
  logger: {
    child: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    }))
  }
}));

const bcrypt = require('bcryptjs');
const authenticationHelper = require('../../helpers/authentication');
const userModel = require('../userModel');
const userAuthModel = require('../userAuthModel');
const authModel = require('../authModel');
const mailHelper = require('../../helpers/mail');

jest.mock('moment', () => {
  const mockMoment = {
    format: () => '2019-12-06 00:11:22'
  };

  const fn = () => mockMoment;
  fn.unix = () => mockMoment;
  return fn;
});

jest.mock('uuid', () => ({
  v4: () => 'my-uuid'
}));

jest.mock('../../helpers/authentication');

describe('authModel', () => {
  let result;
  let error;
  describe('login', () => {
    describe('when user is not found', () => {
      beforeEach(async () => {
        userModel.getOne = jest.fn().mockResolvedValue([]);
        try {
          result = await authModel.login('my-username', 'your-password');
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('Your username or password is incorrect.'));
      });
    });

    describe('when user is blocked', () => {
      beforeEach(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          blocked_at: '2019-10-05T23:33:22Z'
        });
        try {
          result = await authModel.login('my-username', 'your-password');
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('You are not allowed to login.'));
      });
    });

    describe('when user is not confirmed', () => {
      describe('confirmed_at is null', () => {
        beforeEach(async () => {
          userModel.getOne = jest.fn().mockResolvedValue({
            blocked_at: null,
            confirmed_at: null
          });
          try {
            result = await authModel.login('my-username', 'your-password');
          } catch (e) {
            error = e;
          }
        });

        it('throws exception', () => {
          expect(error).toStrictEqual(new Error('Your email is not verified. Please verify your email and try again.'));
        });
      });

      describe('confirmed_at is empty string', () => {
        beforeEach(async () => {
          userModel.getOne = jest.fn().mockResolvedValue({
            blocked_at: null,
            confirmed_at: ''
          });
          try {
            result = await authModel.login('my-username', 'your-password');
          } catch (e) {
            error = e;
          }
        });

        it('throws exception', () => {
          expect(error).toStrictEqual(new Error('Your email is not verified. Please verify your email and try again.'));
        });
      });
    });

    describe('when user password is not same', () => {
      beforeEach(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          blocked_at: null,
          confirmed_at: '2019-10-05T23:33:22Z',
          password_hash: 'not-valid-hash'
        });

        try {
          result = await authModel.login('my-username', 'your-password');
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('Your username or password is incorrect. Please try again.'));
      });
    });

    describe('when username and password are valid', () => {
      describe('when processing login is failed', () => {
        beforeEach(async () => {
          // To throw exception in processLogin
          authenticationHelper.generateToken.mockImplementation(() => {
            throw new Error('something happened');
          });

          userModel.getOne = jest.fn().mockResolvedValue({
            id: 10,
            first_name: 'Chris',
            last_name: 'Lee',
            email: 'chris.lee@boilerplate.local',
            role: userModel.userRole.user,
            permissions: [],
            blocked_at: null,
            confirmed_at: '2019-10-05T23:33:22Z',
            password_hash: 'valid-hash'
          });

          bcrypt.compareSync = jest.fn().mockReturnValue(true);

          try {
            result = await authModel.login('my-username', 'your-password', [userModel.userRole.user], {
              ipAddress: ''
            });
          } catch (e) {
            error = e;
          }
        });

        it('throws exception', () => {
          expect(error).toStrictEqual(
            new Error('There was a problem while processing login request. Please try again.')
          );
        });
      });

      describe('when processing login is success', () => {
        beforeEach(async () => {
          authenticationHelper.generateToken.mockReturnValueOnce('my-jwt-token');

          authenticationHelper.verifyToken.mockResolvedValue({
            exp: Date.now()
          });

          authenticationHelper.generateRefreshToken.mockReturnValueOnce('my-refresh-jwt-token');

          authenticationHelper.verifyRefreshToken.mockResolvedValue({
            exp: Date.now()
          });

          userModel.getOne = jest.fn().mockResolvedValue({
            id: 10,
            first_name: 'Chris',
            last_name: 'Lee',
            email: 'chris.lee@boilerplate.local',
            role: userModel.userRole.staff,
            permissions: [{ permission_key: 'permission 1' }, { permission_key: 'permission 2' }],
            blocked_at: null,
            confirmed_at: '2019-10-05T23:33:22Z',
            password_hash: 'valid-hash'
          });
          userAuthModel.insertOne = jest.fn();
          userModel.updateOne = jest.fn();

          bcrypt.genSaltSync = jest.fn().mockReturnValue(1);
          bcrypt.hashSync = jest.fn().mockReturnValue('encrypted-auth-key');
          bcrypt.compareSync = jest.fn().mockReturnValue(true);

          result = await authModel.login(
            'my-username',
            'your-password',
            [userModel.userRole.administrator, userModel.userRole.staff],
            {
              ipAddress: '123.123.123.123'
            }
          );
        });

        it('triggers userModel.getOne', () => {
          expect(userModel.getOne).toHaveBeenCalledWith({
            searchOptions: {
              usernameOrEmail: 'my-username',
              enabled: userModel.userEnabled.active,
              status: userModel.userStatus.active,
              roles: [userModel.userRole.administrator, userModel.userRole.staff]
            },
            includePasswordHash: true,
            includePermissions: true
          });
        });

        it('triggers generateToken', () => {
          expect(authenticationHelper.generateToken).toHaveBeenCalledWith({
            id: 10,
            first_name: 'Chris',
            last_name: 'Lee',
            email: 'chris.lee@boilerplate.local',
            role: userModel.userRole.staff,
            permission_keys: ['permission 1', 'permission 2']
          });
        });

        it('triggers userModel.updateOne', () => {
          expect(userModel.updateOne).toHaveBeenCalledWith(10, {
            id: 10,
            last_login_at: '2019-12-06 00:11:22',
            last_login_ip: '123.123.123.123'
          });
        });

        it('returns value', () => {
          expect(result).toStrictEqual({
            auth_key: 'my-jwt-token',
            refresh_auth_key: 'my-refresh-jwt-token'
          });
        });
      });
    });
  });

  describe('register', () => {
    beforeEach(async () => {
      userModel.insertOne = jest.fn().mockResolvedValue({
        result: true
      });

      mailHelper.sendEmail = jest.fn().mockResolvedValue(true);

      result = await authModel.register(
        {
          username: 'my-username',
          password: 'my-password',
          firstName: 'Chris',
          lastName: 'Lee',
          email: 'chris.lee@boilerplate.local',
          registrationIp: '123.123.123.123',
          role: userModel.userRole.user,
          status: userModel.userStatus.active
        },
        { apiURL: 'http://localhost/api' }
      );
    });

    it('triggers userModel.inserOne', () => {
      expect(userModel.insertOne).toHaveBeenCalledWith({
        username: 'my-username',
        auth_key: 'my-uuid',
        auth_key_expired_at: null,
        first_name: 'Chris',
        last_name: 'Lee',
        password: 'my-password',
        email: 'chris.lee@boilerplate.local',
        confirmed_at: null,
        registration_ip: '123.123.123.123',
        last_login_at: null,
        last_login_ip: null,
        blocked_at: null,
        role: userModel.userRole.user,
        enabled: userModel.userEnabled.active,
        status: userModel.userStatus.active
      });
    });

    it('triggers mail.sendEmail', () => {
      expect(mailHelper.sendEmail).toHaveBeenCalledWith({
        to: 'chris.lee@boilerplate.local',
        subject: 'Email verification',
        templatePath: 'app/templates/register-confirm.html',
        templateValues: {
          first_name: 'Chris',
          verification_link: `http://localhost/api/register-confirm?key=my-uuid`
        }
      });
    });

    it('returns expected value', () => {
      expect(result).toStrictEqual({ result: true });
    });
  });

  describe('registerConfirm', () => {
    beforeEach(async () => {
      userModel.getOne = jest.fn().mockResolvedValue({
        id: 10
      });

      userModel.updateOne = jest.fn().mockResolvedValue({ result: true });

      result = await authModel.registerConfirm({ authKey: 'my-uuid' });
    });

    it('triggers userModel.getOne', () => {
      expect(userModel.getOne).toHaveBeenCalledWith({
        searchOptions: {
          auth_key: 'my-uuid',
          status: userModel.userStatus.pending
        }
      });
    });

    it('triggers updateOne', () => {
      expect(userModel.updateOne).toHaveBeenCalledWith(10, {
        auth_key: null,
        auth_key_expired_at: null,
        confirmed_at: '2019-12-06 00:11:22',
        status: userModel.userStatus.active
      });
    });
  });

  describe('passwordResetRequest', () => {
    describe('when user is not found', () => {
      beforeEach(async () => {
        userModel.getOne = jest.fn().mockResolvedValue([]);

        try {
          result = await authModel.passwordResetRequest(
            { email: 'chris.lee@boilerplate.local' },
            { apiURL: 'http://localhost/api' }
          );
        } catch (e) {
          error = e;
        }
      });

      it('throws expected error', () => {
        expect(error).toStrictEqual(new Error('The system could not find the requested user.'));
      });
    });

    describe('when user is found', () => {
      beforeEach(async () => {
        userModel.getOne = jest.fn().mockResolvedValue({
          id: 10,
          first_name: 'Chris'
        });

        userModel.updateOne = jest.fn().mockResolvedValue({ result: true });
        mailHelper.sendEmail = jest.fn().mockResolvedValue(true);

        result = await authModel.passwordResetRequest(
          { email: 'chris.lee@boilerplate.local' },
          { apiURL: 'http://localhost/api' }
        );
      });

      it('triggers userModel.getOne', () => {
        expect(userModel.getOne).toHaveBeenCalledWith({
          searchOptions: { email: 'chris.lee@boilerplate.local', status: userModel.userStatus.active }
        });
      });

      it('triggers userModel.updateOne', () => {
        expect(userModel.updateOne).toHaveBeenCalledWith(10, { password_reset_token: 'my-uuid' });
      });

      it('triggers mail.sendEmail', () => {
        expect(mailHelper.sendEmail).toHaveBeenCalledWith({
          to: 'chris.lee@boilerplate.local',
          subject: 'Password reset',
          templatePath: 'app/templates/password-reset.html',
          templateValues: {
            first_name: 'Chris',
            password_reset_link: `http://localhost/api/password-reset-verify?key=my-uuid`
          }
        });
      });
    });
  });

  describe('passwordReset', () => {
    beforeEach(async () => {
      userModel.getOne = jest.fn().mockResolvedValue({
        id: 10
      });

      userModel.updateOne = jest.fn().mockResolvedValue({ result: true });

      result = await authModel.passwordReset({ password: 'my-new-password', passwordResetToken: 'my-uuid' });
    });

    it('triggers userModel.getOne', () => {
      expect(userModel.getOne).toHaveBeenCalledWith({
        searchOptions: {
          password_reset_token: 'my-uuid',
          status: userModel.userStatus.active
        }
      });
    });

    it('triggers userModel.updateOne', () => {
      expect(userModel.updateOne).toHaveBeenCalledWith(10, {
        password: 'my-new-password',
        password_reset_token: null
      });
    });

    it('returns expected result', () => {
      expect(result).toStrictEqual({ result: true });
    });
  });
});
