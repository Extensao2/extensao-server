import { logout } from '../../src/controllers/auth/logout.js';
import { 
  mockLogoutSuccess, 
  mockLogoutError, 
  mockSessionDestroyError,
  expectErrorResponse,
  expectSuccessResponse 
} from '../helpers/testHelpers.js';

describe('Logout Controller', () => {
  let req, res;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful logout', () => {
    it('should logout and destroy session successfully', () => {
      Object.assign(req, mockLogoutSuccess());

      logout(req, res);

      expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
      expect(req.session.destroy).toHaveBeenCalledWith(expect.any(Function));
      expect(res.clearCookie).toHaveBeenCalledWith('session_id');
      expectSuccessResponse(res, 200, { message: 'Logout successful' });
    });

    it('should clear session_id cookie on successful logout', () => {
      Object.assign(req, mockLogoutSuccess());

      logout(req, res);

      expect(res.clearCookie).toHaveBeenCalledWith('session_id');
      expect(res.clearCookie).toHaveBeenCalledTimes(1);
    });
  });

  describe('Logout errors', () => {
    it('should handle logout method error', () => {
      Object.assign(req, mockLogoutError());

      logout(req, res);

      expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
      expectErrorResponse(res, 500, 'Could not log out');
      expect(req.session.destroy).not.toHaveBeenCalled();
      expect(res.clearCookie).not.toHaveBeenCalled();
    });

    it('should handle session destroy error', () => {
      Object.assign(req, mockSessionDestroyError());

      logout(req, res);

      expect(req.logout).toHaveBeenCalledWith(expect.any(Function));
      expect(req.session.destroy).toHaveBeenCalledWith(expect.any(Function));
      expectErrorResponse(res, 500, 'Could not destroy session');
      expect(res.clearCookie).not.toHaveBeenCalled();
    });

    it('should handle missing session object', () => {
      req.logout = jest.fn((callback) => callback(null));
      req.session = undefined;

      expect(() => logout(req, res)).toThrow();
    });
  });
});