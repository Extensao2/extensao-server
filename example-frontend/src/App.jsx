import { useAuth } from './hooks/useAuth';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';

function App() {
  const { authenticated, user, login, logout } = useAuth();

  return (
    <>
      {authenticated ? (
        <Dashboard user={user} onLogout={logout} />
      ) : (
        <Login onLogin={login} />
      )}
    </>
  );
}

export default App;

