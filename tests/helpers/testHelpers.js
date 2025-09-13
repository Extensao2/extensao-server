export const createAuthenticatedUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  email: 'john.doe@example.com',
  name: 'John Doe',
  avatar: 'https://lh3.googleusercontent.com/a/default-user',
  provider: 'google',
  createdAt: new Date('2023-01-01'),
  ...overrides
});

export const createUnauthenticatedRequest = () => ({
  user: null,
  logout: jest.fn(),
  session: {
    destroy: jest.fn()
  }
});

export const expectErrorResponse = (res, status, message) => {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith({
    error: message
  });
};

export const expectSuccessResponse = (res, status, data) => {
  expect(res.status).toHaveBeenCalledWith(status);
  expect(res.json).toHaveBeenCalledWith(data);
};

export const mockLogoutSuccess = () => ({
  logout: jest.fn((callback) => callback(null)),
  session: {
    destroy: jest.fn((callback) => callback(null))
  }
});

export const mockLogoutError = () => ({
  logout: jest.fn((callback) => callback(new Error('Logout failed'))),
  session: {
    destroy: jest.fn()
  }
});

export const mockSessionDestroyError = () => ({
  logout: jest.fn((callback) => callback(null)),
  session: {
    destroy: jest.fn((callback) => callback(new Error('Session destroy failed')))
  }
});