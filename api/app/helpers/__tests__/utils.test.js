const util = require('../util');

describe('utils', () => {
  let result;
  describe('getIPAddress', () => {
    describe('when x-forward-for is provided', () => {
      beforeEach(() => {
        result = util.getIPAddress({
          headers: {
            'x-forwarded-for': '123.123.123.123'
          }
        });
      });

      it('returns expected value', () => {
        expect(result).toBe('123.123.123.123');
      });
    });

    describe('when x-forward-for is not provided', () => {
      beforeEach(() => {
        result = util.getIPAddress({
          headers: {},
          connection: {
            remoteAddress: '111.222.333.444'
          }
        });
      });

      it('returns expected value', () => {
        expect(result).toBe('111.222.333.444');
      });
    });
  });
});
