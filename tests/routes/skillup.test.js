import request from 'supertest';
import express from 'express';
import session from 'express-session';
import { describe, it, expect, jest, afterEach } from '@jest/globals';

import skillupRoutes from '../../src/routes/skillup.js';
import SkillUpController from '../../src/controllers/SkillUpController.js';

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  app.use('/api/v1', skillupRoutes);

  return app;
};

const createAuthedTestApp = () => {
  const app = express();
  app.use(express.json());

  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  app.use('/api/v1', (req, res, next) => {
    if (!req.user) {
      req.user = {
        _id: '000000000000000000000000',
        email: 'mock.user@example.com',
        name: 'Usuário Mock',
      };
    }
    next();
  });

  app.use('/api/v1', skillupRoutes);

  return app;
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('GET /api/v1/skillup/products', () => {
  it('Happy Path - deve retornar lista de produtos (200)', async () => {
    const mockProducts = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' }
    ];

    const getProductsMock = jest
      .spyOn(SkillUpController, 'getProducts')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: mockProducts });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/products')
      .expect(200);

    expect(getProductsMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual({ data: mockProducts });
  });
});


describe('POST /api/v1/skillup/user/me/buy-product', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const buyProductSpy = jest
      .spyOn(SkillUpController, 'buyProduct')
      .mockImplementation((req, res) => {
        return res.status(200).json({});
      });

    const app = createTestApp();

    const response = await request(app)
      .post('/api/v1/skillup/user/me/buy-product')
      .send({ productId: '123' })
      .expect(401);

    expect(buyProductSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { success: true } };

    const buyProductMock = jest
      .spyOn(SkillUpController, 'buyProduct')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .post('/api/v1/skillup/user/me/buy-product')
      .send({ productId: '123' })
      .expect(200);

    expect(buyProductMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('POST /api/v1/skillup/user/me/equip-item', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const equipItemSpy = jest
      .spyOn(SkillUpController, 'equipItem')
      .mockImplementation((req, res) => {
        return res.status(200).json({});
      });

    const app = createTestApp();

    const response = await request(app)
      .post('/api/v1/skillup/user/me/equip-item')
      .send({ itemId: '123' })
      .expect(401);

    expect(equipItemSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { equipped: true } };

    const equipItemMock = jest
      .spyOn(SkillUpController, 'equipItem')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .post('/api/v1/skillup/user/me/equip-item')
      .send({ itemId: '123' })
      .expect(200);

    expect(equipItemMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('GET /api/v1/skillup/game-mode/can-access-recommendation-mode', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const canAccessSpy = jest
      .spyOn(SkillUpController, 'canAccessRecommendationMode')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: { canAccess: true } });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/game-mode/can-access-recommendation-mode')
      .expect(401);

    expect(canAccessSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { canAccess: true } };

    const canAccessMock = jest
      .spyOn(SkillUpController, 'canAccessRecommendationMode')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/game-mode/can-access-recommendation-mode')
      .expect(200);

    expect(canAccessMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('GET /api/v1/skillup/campaign/phase-groups', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const phaseGroupsSpy = jest
      .spyOn(SkillUpController, 'getCampaignPhaseGroups')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: [] });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/campaign/phase-groups')
      .expect(401);

    expect(phaseGroupsSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: [] };

    const phaseGroupsMock = jest
      .spyOn(SkillUpController, 'getCampaignPhaseGroups')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/campaign/phase-groups')
      .expect(200);

    expect(phaseGroupsMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('POST /api/v1/skillup/user/me/played-phases', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const playedPhasesSpy = jest
      .spyOn(SkillUpController, 'assignPhasesToCurrentUser')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: {} });
      });

    const app = createTestApp();

    const response = await request(app)
      .post('/api/v1/skillup/user/me/played-phases')
      .send({ phases: [] })
      .expect(401);

    expect(playedPhasesSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { email: 'mock.user@example.com', playedPhases: [] } };

    const playedPhasesMock = jest
      .spyOn(SkillUpController, 'assignPhasesToCurrentUser')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .post('/api/v1/skillup/user/me/played-phases')
      .send({ phases: [] })
      .expect(200);

    expect(playedPhasesMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('GET /api/v1/skillup/user/played-phases/:email', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const getPlayedSpy = jest
      .spyOn(SkillUpController, 'getPlayedPhasesByEmail')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: {} });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/user/played-phases/test@example.com')
      .expect(401);

    expect(getPlayedSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { email: 'test@example.com', playedPhases: [] } };

    const getPlayedMock = jest
      .spyOn(SkillUpController, 'getPlayedPhasesByEmail')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/user/played-phases/test@example.com')
      .expect(200);

    expect(getPlayedMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('GET /api/v1/skillup/user/me', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const getUserMeSpy = jest
      .spyOn(SkillUpController, 'getUserMe')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: {} });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/user/me')
      .expect(401);

    expect(getUserMeSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { email: 'mock.user@example.com' } };

    const getUserMeMock = jest
      .spyOn(SkillUpController, 'getUserMe')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/user/me')
      .expect(200);

    expect(getUserMeMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('GET /api/v1/skillup/phases/:id', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const getPhaseDetailSpy = jest
      .spyOn(SkillUpController, 'getPhaseDetail')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: {} });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/phases/123')
      .expect(401);

    expect(getPhaseDetailSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = { data: { id: '123', name: 'Fase Mock' } };

    const getPhaseDetailMock = jest
      .spyOn(SkillUpController, 'getPhaseDetail')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/phases/123')
      .expect(200);

    expect(getPhaseDetailMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});

describe('GET /api/v1/skillup/selection-mode/phases/:materia', () => {
  it('Bad Path - deve retornar 401 quando o usuário não está autenticado', async () => {
    const selectionSpy = jest
      .spyOn(SkillUpController, 'getSelectionModePhase')
      .mockImplementation((req, res) => {
        return res.status(200).json({ data: {} });
      });

    const app = createTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/selection-mode/phases/0')
      .expect(401);

    expect(selectionSpy).not.toHaveBeenCalled();
    expect(response.body).toEqual({
      error: 'Authentication required',
      oauth_url: '/api/v1/auth/google'
    });
  });

  it('Happy Path - deve chamar o controller quando o usuário está autenticado', async () => {
    const mockResponse = {
      data: {
        subjectId: 0,
        category: 'MATH',
        totalQuestions: 10,
        questions: []
      }
    };

    const selectionMock = jest
      .spyOn(SkillUpController, 'getSelectionModePhase')
      .mockImplementation((req, res) => {
        return res.status(200).json(mockResponse);
      });

    const app = createAuthedTestApp();

    const response = await request(app)
      .get('/api/v1/skillup/selection-mode/phases/0')
      .expect(200);

    expect(selectionMock).toHaveBeenCalledTimes(1);
    expect(response.body).toEqual(mockResponse);
  });
});
