jest.mock('express-validator');

const expressValidator = require('express-validator');

const response = require('../response');

const authentication = require('../authentication');
const userModel = require('../../models/userModel');
const permissionModel = require('../../models/permissionModel');

jest.mock('../../helpers/authentication', () => ({
  getTokenData: jest.fn()
}));

jest.mock('../../models/userModel', () => ({
  userRole: {
    administrator: 99,
    staff: 50,
    user: 1
  }
}));

jest.mock('../../models/permissionModel', () => ({
  findPermissionUsers: jest.fn()
}));

let req = {};
let res = {};

describe('response', () => {
  let result;

  beforeEach(() => {
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      redirect: jest.fn()
    };
  });

  describe('handleValidationError', () => {
    describe('when there is no error', () => {
      beforeEach(() => {
        req = {};
        expressValidator.validationResult.mockImplementation(() => ({
          isEmpty: jest.fn().mockReturnValue(true)
        }));
        result = response.handleValidationError(req, res);
      });

      it('returns null', () => {
        expect(result).toBeNull();
      });
    });

    describe('when there is a error', () => {
      beforeEach(() => {
        req = {};
        expressValidator.validationResult.mockImplementation(() => ({
          isEmpty: jest.fn().mockReturnValue(false),
          array: jest.fn().mockReturnValue([{ test: 'error' }])
        }));
        result = response.handleValidationError(req, res);
      });

      it('triggers res.status', () => {
        expect(res.status).toHaveBeenCalledWith(422);
      });

      it('triggers res.json', () => {
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 422,
          message: 'There is a validation error.',
          data: [
            {
              test: 'error'
            }
          ]
        });
      });
    });

    describe('when there are errors', () => {
      beforeEach(() => {
        req = {};
        expressValidator.validationResult.mockImplementation(() => ({
          isEmpty: jest.fn().mockReturnValue(false),
          array: jest.fn().mockReturnValue([{ test1: 'error1' }, { test2: 'error2' }])
        }));
        result = response.handleValidationError(req, res);
      });

      it('triggers res.status', () => {
        expect(res.status).toHaveBeenCalledWith(422);
      });

      it('triggers res.json', () => {
        expect(res.json).toHaveBeenCalledWith({
          success: false,
          status: 422,
          message: 'There are validation errors.',
          data: [
            {
              test1: 'error1'
            },
            {
              test2: 'error2'
            }
          ]
        });
      });
    });
  });

  describe('handleCustomValidationError', () => {
    beforeEach(() => {
      result = response.handleCustomValidationError(res, [{ test: 'custom error' }]);
    });

    it('triggers res.status', () => {
      expect(res.status).toHaveBeenCalledWith(422);
    });

    it('triggers res.json', () => {
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 422,
        message: 'There is a validation error.',
        data: [{ test: 'custom error' }]
      });
    });
  });

  describe('handleSuccess', () => {
    beforeEach(() => {
      result = response.handleSuccess(res, 'test success', { some: 'value' });
    });

    it('triggers res.status', () => {
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('triggers res.json', () => {
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        status: 200,
        message: 'test success',
        data: { some: 'value' }
      });
    });
  });

  describe('handleNotFound', () => {
    beforeEach(() => {
      result = response.handleNotFound(res, 'page not found');
    });

    it('triggers res.status', () => {
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('triggers res.json', () => {
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 404,
        message: 'page not found',
        data: {}
      });
    });
  });

  describe('handleForbidden', () => {
    beforeEach(() => {
      result = response.handleForbidden(res, 'access forbidden');
    });

    it('triggers res.status', () => {
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('triggers res.json', () => {
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        status: 403,
        message: 'access forbidden',
        data: {}
      });
    });
  });

  describe('handleRedirect', () => {
    beforeEach(() => {
      result = response.handleRedirect(res, 302, 'http://test.com');
    });

    it('triggers res.redirect', () => {
      expect(res.redirect).toHaveBeenCalledWith(302, 'http://test.com');
    });
  });

  describe('validateRequest', () => {
    describe('when handleValidationError returns something', () => {
      beforeEach(async () => {
        expressValidator.validationResult.mockImplementation(() => ({
          isEmpty: jest.fn().mockReturnValue(false),
          array: jest.fn().mockReturnValue([{ test: 'error' }])
        }));
        result = await response.validateRequest(req, res, {});
      });

      it('does not trigger getTokenData', () => {
        expect(authentication.getTokenData).not.toHaveBeenCalled();
      });
    });

    describe('when handleValidationError returns no error', () => {
      describe('permissionKey is provided', () => {
        describe('role is administrator', () => {
          beforeEach(async () => {
            authentication.getTokenData.mockImplementation(async () => ({
              role: userModel.userRole.administrator
            }));

            expressValidator.validationResult.mockImplementation(() => ({
              isEmpty: jest.fn().mockReturnValue(true)
            }));

            result = await response.validateRequest(req, res, {
              permissionKey: 'manageTodo'
            });
          });

          it('triggers getTokenData', () => {
            expect(authentication.getTokenData).toHaveBeenCalledWith(req);
          });
        });

        describe('role is staff', () => {
          beforeEach(() => {
            authentication.getTokenData.mockImplementation(async () => ({
              id: 10,
              role: userModel.userRole.staff
            }));

            expressValidator.validationResult.mockImplementation(() => ({
              isEmpty: jest.fn().mockReturnValue(true)
            }));
          });

          describe('when findPermissionUsers returns something', () => {
            beforeEach(async () => {
              permissionModel.findPermissionUsers = jest.fn().mockReturnValue([
                {
                  id: 1,
                  name: 'manageTodo'
                }
              ]);
              result = await response.validateRequest(req, res, {
                permissionKey: 'manageTodo'
              });
            });

            it('triggers getTokenData', () => {
              expect(authentication.getTokenData).toHaveBeenCalledWith(req);
            });

            it('triggers findPermissionUsers', () => {
              expect(permissionModel.findPermissionUsers).toHaveBeenCalledWith({
                searchOptions: {
                  'permission_user.user_id': 10,
                  'permission.permission_key': 'manageTodo'
                }
              });
            });

            it('returns null', () => {
              expect(result).toBeNull();
            });
          });

          describe('when findPermissionUsers does not return', () => {
            beforeEach(async () => {
              permissionModel.findPermissionUsers = jest.fn().mockReturnValue([]);
              result = await response.validateRequest(req, res, {
                permissionKey: 'manageTodo'
              });
            });

            it('triggers res.status', () => {
              expect(res.status).toHaveBeenCalledWith(401);
            });

            it('triggers res.json', () => {
              expect(res.json).toHaveBeenCalledWith({
                success: false,
                status: 401,
                message: 'You do not have a permission to perform this action.',
                data: {}
              });
            });
          });
        });

        describe('role is user', () => {
          beforeEach(async () => {
            authentication.getTokenData.mockImplementation(async () => ({
              id: 10,
              role: userModel.userRole.user
            }));

            expressValidator.validationResult.mockImplementation(() => ({
              isEmpty: jest.fn().mockReturnValue(true)
            }));
            result = await response.validateRequest(req, res, {
              permissionKey: 'manageTodo'
            });
          });

          it('triggers res.status', () => {
            expect(res.status).toHaveBeenCalledWith(401);
          });

          it('triggers res.json', () => {
            expect(res.json).toHaveBeenCalledWith({
              success: false,
              status: 401,
              message: 'You do not have a permission to perform this action.',
              data: {}
            });
          });
        });
      });

      describe('permissionKey is not provided', () => {
        beforeEach(async () => {
          authentication.getTokenData.mockImplementation(async () => ({
            role: userModel.userRole.staff
          }));

          expressValidator.validationResult.mockImplementation(() => ({
            isEmpty: jest.fn().mockReturnValue(true)
          }));

          result = await response.validateRequest(req, res, {});
        });

        it('returns expected value', () => {
          expect(result).toBeNull();
        });
      });
    });
  });
});
