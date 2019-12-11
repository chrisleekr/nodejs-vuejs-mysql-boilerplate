import utils from '@/helper/utils';

describe('utils.js', () => {
  let result;
  describe('toQueryStrings', () => {
    beforeEach(() => {
      result = utils.toQueryStrings({ test1: 'value1', test2: 'value2' });
    });

    it('returns expected value', () => {
      expect(result).toBe('test1=value1&test2=value2');
    });
  });

  describe('validateDateTime', () => {
    describe('empty value', () => {
      beforeEach(async () => {
        result = await utils.validateDateTime('');
      });

      it('returns expected value', () => {
        expect(result).toBeTruthy();
      });
    });

    describe('value is invalid', () => {
      beforeEach(async () => {
        result = await utils.validateDateTime('invalid datetime');
      });

      it('returns expected value', () => {
        expect(result).toBeFalsy();
      });
    });

    describe('value is valid', () => {
      beforeEach(async () => {
        result = await utils.validateDateTime('2019-12-12 00:11:22');
      });

      it('returns expected value', () => {
        expect(result).toBeTruthy();
      });
    });
  });
});
