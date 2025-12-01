import request from 'supertest';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import authRoutes from '../../src/routes/auth.js';
import '../../src/config/passport.js';

describe('GET /api/v1/auth/google (fluxo REAL)', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));

    // Inicializa passport real
    app.use(passport.initialize());
    app.use(passport.session());

    // Carrega rotas reais
    app.use('/api/v1', authRoutes);
  });

  it('deve redirecionar para o Google OAuth com os scopes corretos', async () => {
    const response = await request(app)
      .get('/api/v1/auth/google')
      .expect(302);

    expect(response.headers.location).toContain('accounts.google.com');
    expect(response.headers.location).toContain('scope=');
    expect(response.headers.location).toContain('client_id=');
    expect(response.headers.location).toContain('redirect_uri=');
  });
});
