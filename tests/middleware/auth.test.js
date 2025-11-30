import { requireAuth, optionalAuth } from '../../src/middleware/auth.js';
import { describe, it, expect, jest } from '@jest/globals';

describe('requireAuth middleware', () => {
  describe('Happy Path - Usuário autenticado', () => {
    it('deve chamar next() quando req.user existe', () => {
      const req = { user: { _id: '123', email: 'test@example.com' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('Falha - Usuário não autenticado', () => {
    it('deve retornar 401 quando req.user é undefined', () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
        oauth_url: '/api/v1/auth/google'
      });
    });

    it('deve retornar 401 quando req.user é null', () => {
      const req = { user: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      requireAuth(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required',
        oauth_url: '/api/v1/auth/google'
      });
    });
  });
});

describe('optionalAuth middleware', () => {
  it('deve sempre chamar next() independente de req.user', () => {
    const req = {};
    const res = {};
    const next = jest.fn();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve chamar next() quando req.user existe', () => {
    const req = { user: { _id: '123' } };
    const res = {};
    const next = jest.fn();

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
