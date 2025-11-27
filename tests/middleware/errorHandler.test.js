import { errorHandler } from '../../src/middleware/errorHandler.js';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

describe('errorHandler middleware', () => {
  let req;
  let res;
  let next;
  let consoleSpy;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('Mongoose ValidationError', () => {
    it('deve retornar 400 com detalhes de validação', () => {
      const err = {
        name: 'ValidationError',
        errors: {
          email: { message: 'Email is required' },
          name: { message: 'Name is required' }
        }
      };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation Error',
        details: ['Email is required', 'Name is required']
      });
    });
  });

  describe('Mongoose duplicate key error (code 11000)', () => {
    it('deve retornar 400 com mensagem de campo duplicado', () => {
      const err = {
        code: 11000,
        keyValue: { email: 'test@example.com' }
      };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'email already exists'
      });
    });
  });

  describe('Mongoose CastError', () => {
    it('deve retornar 400 com mensagem de ID inválido', () => {
      const err = {
        name: 'CastError'
      };

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid ID format'
      });
    });
  });

  describe('Erro genérico (default)', () => {
    it('deve retornar 500 para erros desconhecidos', () => {
      const err = new Error('Unknown error');

      errorHandler(err, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Internal server error'
      });
    });
  });

  describe('Console logging', () => {
    it('deve logar o erro no console', () => {
      const err = new Error('Test error');

      errorHandler(err, req, res, next);

      expect(consoleSpy).toHaveBeenCalledWith('Error:', err);
    });
  });
});
