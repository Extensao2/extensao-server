/**
 * Componente de Login
 * 
 * Exibe um botão para iniciar o processo de autenticação OAuth
 */
export function Login({ onLogin }) {
  return (
    <div>
      <h1>Sistema de Aprendizagem</h1>
      <p>Faça login para continuar</p>
      <button onClick={onLogin}>
        Login com Google
      </button>
    </div>
  );
}

