import { useAuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="brand-dot" />
          <span className="brand-name">Expense Tracker</span>
        </div>
        <div className="navbar-right">
          <span className="navbar-email">{user?.email}</span>
          <button className="btn-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
