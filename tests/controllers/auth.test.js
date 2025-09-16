// Import functions directly instead of from authController object
import { login, getMe, status, logout } from '../../src/controllers/auth/index.js';

import User from '../../src/models/User.js';
jest.mock('../../src/models/User.js');

const mockRequest = (user = null) => ({
    user,
    logout: jest.fn(),
    session: { destroy: jest.fn() },
    cookies: {},
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
};

describe('Auth Controller Unit Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ------------------- login -------------------
    describe('login', () => {
        it('should return 400 with OAuth URL', () => {
            const req = mockRequest();
            const res = mockResponse();

            login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                error: 'Traditional login disabled. Please use Google OAuth.',
                oauth_url: '/api/v1/auth/google'
            });
        });
    });

});