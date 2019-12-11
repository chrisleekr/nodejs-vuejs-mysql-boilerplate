import moment from 'moment';
import User from '../../../src/model/user';

describe('user.js', () => {
  let result;
  const userJson = {
    rowNum: null,
    id: 10,
    username: 'chrislee',
    firstName: 'Chris',
    lastName: 'Lee',
    email: 'chris.lee@boilerplate.local',
    confirmedAt: null,
    registrationIp: '123.123.123.123',
    lastLoginAt: null,
    lastLoginIp: '123.123.123.123',
    blockedAt: null,
    role: User.userRole.staff,
    roleName: 'Staff',
    permissions: [],
    enabled: User.userEnabled.active,
    enabledName: 'Enabled'
  };

  describe('constructor', () => {
    beforeEach(() => {});
    describe('without rowNum and no date', () => {
      beforeEach(() => {
        result = new User(userJson);
      });

      it('sets expected values', () => {
        expect(result.rowNum).toBeNull();
        expect(result.id).toBe(10);
        expect(result.username).toBe('chrislee');
        expect(result.firstName).toBe('Chris');
        expect(result.lastName).toBe('Lee');
        expect(result.fullName).toBe('Chris, Lee');
        expect(result.email).toBe('chris.lee@boilerplate.local');
        expect(result.confirmedAt).toBeNull();
        expect(result.confirmedAtFormatted).toBeNull();
        expect(result.registrationIp).toBe('123.123.123.123');
        expect(result.lastLoginAt).toBeNull();
        expect(result.lastLoginAtFormatted).toBeNull();
        expect(result.lastLoginIp).toBe('123.123.123.123');
        expect(result.blockedAt).toBeNull();
        expect(result.blockedAtFormatted).toBeNull();
        expect(result.role).toBe(User.userRole.staff);
        expect(result.roleName).toBe('Staff');
        expect(result.permissions).toStrictEqual([]);
        expect(result.enabled).toBe(User.userEnabled.active);
        expect(result.enabledName).toBe('Enabled');
      });
    });

    describe('with rowNum and date', () => {
      beforeEach(() => {
        userJson.rowNum = 1;
        userJson.confirmedAt = '2019-12-01 00:11:22';
        userJson.lastLoginAt = '2019-12-02 00:11:22';
        userJson.blockedAt = '2019-12-03 00:11:22';
        userJson.permissions = [{ permission: 'something' }];

        result = new User(userJson);
      });

      it('sets expected values', () => {
        expect(result.rowNum).toBe(1);
        expect(result.confirmedAt).toBe('2019-12-01 00:11:22');
        expect(result.confirmedAtFormatted).toBe(moment('2019-12-01 00:11:22').from());
        expect(result.lastLoginAt).toBe('2019-12-02 00:11:22');
        expect(result.lastLoginAtFormatted).toBe(moment('2019-12-02 00:11:22').from());
        expect(result.blockedAt).toBe('2019-12-03 00:11:22');
        expect(result.blockedAtFormatted).toBe(moment('2019-12-03 00:11:22').from());
        expect(result.permissions).toStrictEqual([{ permission: 'something' }]);
      });
    });
  });
});
