import { getMe, status } from '../../src/controllers/auth/profile.js';
import { createAuthenticatedUser, expectErrorResponse } from '../helpers/testHelpers.js';

describe('Profile Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe Controller', () => {
    describe('Authenticated user', () => {
      it('should return complete user data', () => {
        req.user = createAuthenticatedUser();

        getMe(req, res);

        expect(res.json).toHaveBeenCalledWith({
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          avatar: req.user.avatar,
          provider: req.user.provider
        });
      });

      it('should map _id to id field', () => {
        req.user = createAuthenticatedUser({ _id: 'test123' });

        getMe(req, res);

        const response = res.json.mock.calls[0][0];
        expect(response.id).toBe('test123');
        expect(response).not.toHaveProperty('_id');
      });
    });

    describe('Unauthenticated user', () => {
      it('should return 401 when user is null', () => {
        req.user = null;

        getMe(req, res);

        expectErrorResponse(res, 401, 'Not authenticated');
      });

      it('should return 401 when user is undefined', () => {
        req.user = undefined;

        getMe(req, res);

        expectErrorResponse(res, 401, 'Not authenticated');
      });
    });
  });

  describe('status Controller', () => {
    describe('Authenticated status', () => {
      it('should return authenticated true with user data', () => {
        req.user = createAuthenticatedUser();

        status(req, res);

        expect(res.json).toHaveBeenCalledWith({
          authenticated: true,
          user: {
            id: req.user._id,
            email: req.user.email,
            name: req.user.name,
            avatar: req.user.avatar
          }
        });
      });
    });

    describe('Unauthenticated status', () => {
      it('should return authenticated false when user is null', () => {
        req.user = null;

        status(req, res);

        expect(res.json).toHaveBeenCalledWith({
          authenticated: false,
          user: null
        });
      });
    });
  });
});