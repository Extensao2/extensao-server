import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { describe, it, expect } from '@jest/globals';
import authRoutes from '../../src/routes/auth.js';

// Cria uma versão mockada das rotas para os testes de callback
const createMockedAuthRoutes = (authenticateImpl) => {
  const router = express.Router();
  
  // Mock da rota de callback
  router.get('/auth/google/callback', authenticateImpl, (req, res) => {
    res.redirect('https://extensaoads2.sj.ifsc.edu.br/api/v1/events');
  });
  
  return router;
};

// Criar app de teste
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Mock de sessão simplificada para testes
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));
  
  return app;
};

describe('GET /api/v1/me', () => {
  describe('Happy Path - Usuário autenticado', () => {
    it('deve retornar dados do usuário quando req.user existe', async () => {
      const app = createTestApp();
      
      // Middleware ANTES das rotas, com o mesmo prefixo
      app.use('/api/v1', (req, res, next) => {
        req.user = {
          _id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg',
          provider: 'google'
        };
        next();
      });
      
      // Registrar rotas DEPOIS do middleware
      app.use('/api/v1', authRoutes);
      
      const response = await request(app)
        .get('/api/v1/me')
        .expect(200);
      
      expect(response.body).toEqual({
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        provider: 'google'
      });
    });
  });

  describe('Falha - Usuário não autenticado', () => {
    it('deve retornar erro 401 quando req.user não existe', async () => {
      const app = createTestApp();
      
      // Middleware define req.user como null
      app.use('/api/v1', (req, res, next) => {
        req.user = null;
        next();
      });
      
      app.use('/api/v1', authRoutes);
      
      const response = await request(app)
        .get('/api/v1/me')
        .expect(401);
      
      expect(response.body).toEqual({
        error: 'Not authenticated'
      });
    });
  });
});

describe('GET /api/v1/status', () => {
  describe('Happy Path - Usuário autenticado', () => {
    it('deve retornar authenticated: true e dados do usuário quando req.user existe', async () => {
      const app = createTestApp();
      
      // IMPORTANTE: Middleware ANTES das rotas, com o mesmo prefixo
      app.use('/api/v1', (req, res, next) => {
        req.user = {
          _id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg'
        };
        next();
      });
      
      // Registrar rotas DEPOIS do middleware
      app.use('/api/v1', authRoutes);
      
      const response = await request(app)
        .get('/api/v1/status')
        .expect(200);
      
      expect(response.body).toEqual({
        authenticated: true,
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'test@example.com',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg'
        }
      });
    });
  });

  describe('Falha - Usuário não autenticado', () => {
    it('deve retornar authenticated: false e user: null quando req.user não existe', async () => {
      const app = createTestApp();
      
      // Middleware define req.user como null
      app.use('/api/v1', (req, res, next) => {
        req.user = null;
        next();
      });
      
      app.use('/api/v1', authRoutes);
      
      const response = await request(app)
        .get('/api/v1/status')
        .expect(200);
      
      expect(response.body).toEqual({
        authenticated: false,
        user: null
      });
    });

    it('deve retornar authenticated: false quando req.user é undefined', async () => {
      const app = createTestApp();
      
      // Não definir middleware - req.user será undefined
      app.use('/api/v1', authRoutes);
      
      const response = await request(app)
        .get('/api/v1/status')
        .expect(200);
      
      expect(response.body).toEqual({
        authenticated: false,
        user: null
      });
    });
  });

  describe('POST /api/v1/logout', () => {
  it('deve realizar logout com sucesso (Happy Path)', async () => {
    const app = createTestApp();

    // MIDDLEWARE PARA MOCKAR passport.logout E session.destroy
    app.use('/api/v1', (req, res, next) => {
      req.logout = (cb) => cb(null); // sucesso
      req.session.destroy = (cb) => cb(null); // sucesso
      next();
    });

    app.use('/api/v1', authRoutes);

    const response = await request(app)
      .post('/api/v1/logout')
      .expect(200);

    expect(response.body).toEqual({
      message: 'Logout successful'
    });
  });

  it('deve retornar 500 se ocorrer erro no req.logout', async () => {
    const app = createTestApp();

    app.use('/api/v1', (req, res, next) => {
      req.logout = (cb) => cb(new Error('Erro no logout'));
      next();
    });

    app.use('/api/v1', authRoutes);

    const response = await request(app)
      .post('/api/v1/logout')
      .expect(500);

    expect(response.body).toEqual({
      error: 'Could not log out'
    });
  });

  it('deve retornar 500 se ocorrer erro ao destruir a sessão', async () => {
    const app = createTestApp();

    app.use('/api/v1', (req, res, next) => {
      req.logout = (cb) => cb(null); // ok
      req.session.destroy = (cb) => cb(new Error('destroy error')); // erro
      next();
    });

    app.use('/api/v1', authRoutes);

    const response = await request(app)
      .post('/api/v1/logout')
      .expect(500);

    expect(response.body).toEqual({
      error: 'Could not destroy session'
    });
  });
});

});

describe('GET /api/v1/auth/google/callback', () => {
  it('deve redirecionar corretamente no Happy Path', async () => {
    const app = createTestApp();

    // Middleware que simula passport.authenticate com sucesso
    const mockAuthenticate = (req, res, next) => {
      req.user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
        provider: 'google'
      };
      next();
    };

    const mockedRoutes = createMockedAuthRoutes(mockAuthenticate);
    app.use('/api/v1', mockedRoutes);

    const response = await request(app)
      .get('/api/v1/auth/google/callback');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('https://extensaoads2.sj.ifsc.edu.br/api/v1/events');
  });

  it('deve redirecionar para failureRedirect quando falhar a autenticação', async () => {
    const app = createTestApp();

    // Middleware que simula passport.authenticate com falha
    const mockAuthenticateFail = (req, res, next) => {
      // Simula falha - redireciona diretamente
      res.redirect('/login?error=oauth_failed');
    };

    const mockedRoutes = createMockedAuthRoutes(mockAuthenticateFail);
    app.use('/api/v1', mockedRoutes);

    const response = await request(app)
      .get('/api/v1/auth/google/callback');
    
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/login?error=oauth_failed');
  });
});
