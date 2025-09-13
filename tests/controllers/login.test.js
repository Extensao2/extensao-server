import { login } from '../../src/controllers/auth/login.js';

describe('Login Controller', () => {
  let req, res;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Traditional login disabled', () => {
    it('should return 400 status with OAuth redirect message', () => {
      login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Traditional login disabled. Please use Google OAuth.',
        oauth_url: '/api/v1/auth/google'
      });
    });

    it('should not depend on request properties', () => {
      const emptyReq = {};
      login(emptyReq, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Traditional login disabled. Please use Google OAuth.',
        oauth_url: '/api/v1/auth/google'
      });
    });

    it('should always return same response regardless of input', () => {
      const testCases = [
        {},
        { user: null },
        { user: { id: '123' } },
        { body: { email: 'test', password: 'test' } }
      ];

      testCases.forEach(testReq => {
        const mockRes = createMockResponse();
        login(testReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
          error: 'Traditional login disabled. Please use Google OAuth.',
          oauth_url: '/api/v1/auth/google'
        });
      });
    });
  });

  describe('Response format', () => {
    it('should have consistent error response structure', () => {
      login(req, res);

      const response = res.json.mock.calls[0][0];
      expect(response).toHaveProperty('error');
      expect(response).toHaveProperty('oauth_url');
      expect(typeof response.error).toBe('string');
      expect(typeof response.oauth_url).toBe('string');
    });
  });
});