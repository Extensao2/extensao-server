import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { describe, it, expect, jest, beforeAll } from '@jest/globals';

describe('GET /api/v1/auth/google', () => {
  let app;
  let passportMock;

  beforeAll(() => {
    passportMock = {
      authenticate: jest.fn()
    };

    jest.doMock('passport', () => ({
      default: passportMock
    }));
  });

  describe('Happy Path - Redirecionamento para Google OAuth', () => {
    it('deve iniciar o fluxo OAuth com strategy google e scopes corretos', async () => {
      app = express();
      app.use(express.json());
      app.use(session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
      }));

      passportMock.authenticate.mockImplementation((strategy, options) => {
        return (req, res, next) => {
          expect(strategy).toBe('google');
          expect(options.scope).toContain('profile');
          expect(options.scope).toContain('email');
          res.redirect('https://accounts.google.com/o/oauth2/v2/auth');
        };
      });

      const router = express.Router();
      router.get('/auth/google',
        passportMock.authenticate('google', {
          scope: ['profile', 'email']
        })
      );

      app.use('/api/v1', router);

      const response = await request(app)
        .get('/api/v1/auth/google')
        .expect(302);

      expect(response.headers.location).toContain('google.com');
      expect(passportMock.authenticate).toHaveBeenCalled();
    });
  });

  describe('Falha - Erro no middleware de autenticação', () => {
    it('deve retornar erro quando o passport.authenticate lançar exceção', async () => {
      app = express();
      app.use(express.json());
      app.use(session({
        secret: 'test-secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
      }));

      passportMock.authenticate.mockImplementation((strategy, options) => {
        return (req, res, next) => {
          const error = new Error('Google OAuth not configured');
          error.status = 500;
          next(error);
        };
      });

      const router = express.Router();
      router.get('/auth/google',
        passportMock.authenticate('google', {
          scope: ['profile', 'email']
        })
      );

      app.use('/api/v1', router);

      app.use((err, req, res, next) => {
        res.status(err.status || 500).json({
          error: err.message
        });
      });

      const response = await request(app)
        .get('/api/v1/auth/google')
        .expect(500);

      expect(response.body).toEqual({
        error: 'Google OAuth not configured'
      });
      expect(passportMock.authenticate).toHaveBeenCalledWith('google', {
        scope: ['profile', 'email']
      });
    });
  });
});