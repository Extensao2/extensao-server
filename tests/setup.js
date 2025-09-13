// Setup global para todos os testes

// Helper functions globais
global.createMockRequest = (overrides = {}) => ({
  user: null,
  logout: jest.fn(),
  session: {
    destroy: jest.fn()
  },
  ...overrides
});

global.createMockResponse = () => {
  const res = {
    status: jest.fn(),
    json: jest.fn(),
    clearCookie: jest.fn()
  };
  
  // Chain methods
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.clearCookie.mockReturnValue(res);
  
  return res;
};

// Configurações de timeout se necessário
jest.setTimeout(10000);
