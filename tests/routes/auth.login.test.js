import request from 'supertest';
import express from 'express';
import router from '../../src/routes/auth.js';

const app = express();
app.use(express.json());
app.use('/api/v1', router);

describe('POST /api/v1/login', () => {
  
  test('should return 400 status code', async () => {
    const response = await request(app)
      .post('/api/v1/login')
      .send({ email: 'test@test.com', password: '123456' });

    expect(response.status).toBe(400);
  });

  test('should return correct error message', async () => {
    const response = await request(app).post('/api/v1/login');

    expect(response.body.error).toBe('Traditional login disabled. Please use Google OAuth.');
  });

  test('should return oauth_url field', async () => {
    const response = await request(app).post('/api/v1/login');

    expect(response.body).toHaveProperty('oauth_url', '/api/v1/auth/google');
  });

});
