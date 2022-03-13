import api from '@/services/api';
import configService from '@/services/configService';
import authService from '@/services/authService';

jest.mock('@/services/api');

describe('authService.js', () => {
  let result;
  let error;

  beforeEach(() => {
    configService.get = jest.fn(key => key);
  });

  describe('passwordReset', () => {
    describe('when result is returned', () => {
      beforeEach(async () => {
        api.post.mockResolvedValue({ data: { some: 'value' } });
        result = await authService.passwordReset({ key: 'key', password: 'password' });
      });

      it('triggers api.post', () => {
        expect(api.post).toHaveBeenCalledWith(`apiUrl/user/password-reset`, { key: 'key', password: 'password' });
      });

      it('return expected value', () => {
        expect(result).toStrictEqual({ some: 'value' });
      });
    });

    describe('when throw exception', () => {
      beforeEach(async () => {
        api.post.mockRejectedValue(new Error('something happened'));

        try {
          result = await authService.passwordReset('username', 'password');
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('something happened'));
      });
    });
  });

  describe('passwordResetRequest', () => {
    describe('when result is returned', () => {
      beforeEach(async () => {
        api.post.mockResolvedValue({ data: { some: 'value' } });
        result = await authService.passwordResetRequest({ email: 'my@email.com' });
      });

      it('triggers api.post', () => {
        expect(api.post).toHaveBeenCalledWith(`apiUrl/user/password-reset-request`, { email: 'my@email.com' });
      });

      it('return expected value', () => {
        expect(result).toStrictEqual({ some: 'value' });
      });
    });

    describe('when throw exception', () => {
      beforeEach(async () => {
        api.post.mockRejectedValue(new Error('something happened'));

        try {
          result = await authService.passwordResetRequest({ email: 'my@email.com' });
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('something happened'));
      });
    });
  });

  describe('register', () => {
    describe('when result is returned', () => {
      beforeEach(async () => {
        api.post.mockResolvedValue({ data: { some: 'value' } });
        result = await authService.register({
          username: 'username',
          email: 'my@email.com',
          password: '123456',
          firstName: 'Chris',
          lastName: 'Lee'
        });
      });

      it('triggers api.post', () => {
        expect(api.post).toHaveBeenCalledWith(`apiUrl/user/register`, {
          username: 'username',
          email: 'my@email.com',
          password: '123456',
          first_name: 'Chris',
          last_name: 'Lee'
        });
      });

      it('return expected value', () => {
        expect(result).toStrictEqual({ some: 'value' });
      });
    });

    describe('when throw exception', () => {
      beforeEach(async () => {
        api.post.mockRejectedValue(new Error('something happened'));

        try {
          result = await authService.register({
            username: 'username',
            email: 'my@email.com',
            password: '123456',
            firstName: 'Chris',
            lastName: 'Lee'
          });
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('something happened'));
      });
    });
  });

  describe('login', () => {
    describe('when result is returned', () => {
      beforeEach(async () => {
        api.post.mockResolvedValue({ data: { some: 'value' } });
        result = await authService.login('username', 'password');
      });

      it('triggers api.post', () => {
        expect(api.post).toHaveBeenCalledWith(`apiUrl/user/login`, { username: 'username', password: 'password' });
      });

      it('return expected value', () => {
        expect(result).toStrictEqual({ some: 'value' });
      });
    });

    describe('when throw exception', () => {
      beforeEach(async () => {
        api.post.mockRejectedValue(new Error('something happened'));

        try {
          result = await authService.login('username', 'password');
        } catch (e) {
          error = e;
        }
      });

      it('throws exception', () => {
        expect(error).toStrictEqual(new Error('something happened'));
      });
    });
  });
});
