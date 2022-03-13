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

  describe('login', () => {
    describe('when result is returned', () => {
      beforeEach(async () => {
        api.post.mockResolvedValue({ data: { some: 'value' } });
        result = await authService.login('username', 'password');
      });

      it('triggers api.post', () => {
        expect(api.post).toHaveBeenCalledWith(`apiUrl/staff/login`, { username: 'username', password: 'password' });
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
