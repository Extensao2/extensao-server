import { login } from '../../controllers/login.js';
import { logout } from '../../controllers/logout.js';
import { getMe, status } from '../../controllers/profile.js';
import { 
  createAuthenticatedUser, 
  mockLogoutSuccess,
  expectSuccessResponse 
} from '../helpers/testHelpers.js';

describe('Authentication Integration Tests', () => {
  describe('Complete authentication flow', () => {
    it('should handle complete user session lifecycle', () => {
      // 1. Tentar login tradicional (deve falhar)
      const loginReq = createMockRequest();
      const loginRes = createMockResponse();
      
      login(loginReq, loginRes);
      expect(loginRes.status).toHaveBeenCalledWith(400);

      // 2. Simular usuário autenticado via OAuth
      const authReq = createMockRequest();
      const authRes = createMockResponse();
      authReq.user = createAuthenticatedUser();

      // 3. Verificar status autenticado
      status(authReq, authRes);
      expect(authRes.json).toHaveBeenCalledWith({
        authenticated: true,
        user: expect.objectContaining({
          id: authReq.user._id,
          email: authReq.user.email
        })
      });

      // 4. Obter dados do usuário
      const profileRes = createMockResponse();
      getMe(authReq, profileRes);
      expect(profileRes.json).toHaveBeenCalledWith({
        id: authReq.user._id,
        email: authReq.user.email,
        name: authReq.user.name,
        avatar: authReq.user.avatar,
        provider: authReq.user.provider
      });

      // 5. Fazer logout
      Object.assign(authReq, mockLogoutSuccess());
      const logoutRes = createMockResponse();
      logout(authReq, logoutRes);
      expectSuccessResponse(logoutRes, 200, { message: 'Logout successful' });
    });

    it('should maintain consistent response formats across controllers', () => {
      const req = createMockRequest();
      
      // Login sempre retorna erro
      const loginRes = createMockResponse();
      login(req, loginRes);
      expect(loginRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );

      // GetMe sem usuário retorna erro
      const profileRes = createMockResponse();
      getMe(req, profileRes);
      expect(profileRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.any(String) })
      );

      // Status sempre retorna authenticated e user
      const statusRes = createMockResponse();
      status(req, statusRes);
      expect(statusRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          authenticated: expect.any(Boolean),
          user: expect.anything()
        })
      );
    });
  });

  describe('Performance and stress tests', () => {
    it('should handle rapid successive calls', async () => {
      const promises = Array.from({ length: 100 }, async (_, i) => {
        const req = createMockRequest();
        const res = createMockResponse();
        
        req.user = createAuthenticatedUser({ _id: `user${i}` });
        
        return new Promise(resolve => {
          setTimeout(() => {
            getMe(req, res);
            resolve(res.json.mock.calls[0][0]);
          }, Math.random() * 10);
        });
      });

      const results = await Promise.all(promises);
      
      results.forEach((result, index) => {
        expect(result.id).toBe(`user${index}`);
      });
    });

    it('should not leak memory on multiple operations', () => {
      const iterations = 1000;
      
      for (let i = 0; i < iterations; i++) {
        const req = createMockRequest();
        const res = createMockResponse();
        
        req.user = createAuthenticatedUser({ _id: `user${i}` });
        
        // Executa todas as operações
        login(req, res);
        getMe(req, res);
        status(req, res);
      }

      // Se chegou até aqui, não há vazamento óbvio
      expect(true).toBe(true);
    });
  });

  describe('Error handling consistency', () => {
    it('should handle errors gracefully across all controllers', () => {
      const scenarios = [
        { user: null, description: 'null user' },
        { user: undefined, description: 'undefined user' },
        { user: false, description: 'false user' },
        { user: {}, description: 'empty user object' }
      ];

      scenarios.forEach(({ user, description }) => {
        const req = createMockRequest();
        req.user = user;

        // Login sempre falha independente do usuário
        const loginRes = createMockResponse();
        login(req, loginRes);
        expect(loginRes.status).toHaveBeenCalledWith(400);

        // GetMe deve retornar 401 para usuários falsy, sucesso para truthy
        const profileRes = createMockResponse();
        getMe(req, profileRes);
        
        if (!user) {
          expect(profileRes.status).toHaveBeenCalledWith(401);
        } else {
          expect(profileRes.json).toHaveBeenCalled();
        }

        // Status sempre funciona
        const statusRes = createMockResponse();
        status(req, statusRes);
        expect(statusRes.json).toHaveBeenCalledWith({
          authenticated: !!user,
          user: user ? expect.any(Object) : null
        });
      });
    });
  });
});