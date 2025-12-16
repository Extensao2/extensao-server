import api from '../config/api';
import { useState } from 'react';

export function Dashboard({ user, onLogout }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Busca informações completas do usuário do endpoint /me
   */
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await api.get('/me');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Erro ao buscar informações do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Bem-vindo!</h1>
      
      {user && (
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}

      <div>
        <button 
          onClick={fetchUserInfo} 
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Buscar Informações Completas'}
        </button>
        
        {userInfo && (
          <div>
            <h3>Informações do Servidor:</h3>
            <pre>
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        )}

        <button onClick={onLogout}>
          Sair
        </button>
      </div>
    </div>
  );
}

