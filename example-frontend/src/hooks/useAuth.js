import { useState, useEffect } from 'react';
import api from '../config/api';

/**
 * Hook customizado para gerenciar autenticação
 */
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  /**
   * Inicia o processo de login redirecionando para OAuth Google
   */
  const login = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  /**
   * Verifica o status de autenticação no servidor
   */
  const checkAuthStatus = async () => {
    try {
      const response = await api.get('/status');
      setAuthenticated(response.data.authenticated);
      setUser(response.data.user);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setAuthenticated(false);
      setUser(null);
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar estado local independente do resultado
      setAuthenticated(false);
      setUser(null);
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuthStatus();

    // Verificar se veio do callback do OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('code')) {
      // Aguardar um pouco para o servidor processar o callback
      setTimeout(() => {
        checkAuthStatus();
      }, 500);
    }
  }, []);

  return {
    authenticated,
    user,
    login,
    logout,
    checkAuthStatus
  };
}

