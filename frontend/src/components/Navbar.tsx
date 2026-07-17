import { useAuthContext } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <svg className="brand-logo" viewBox="0 0 512 512" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(64, 64)" fill="none" stroke="#7C2D3E" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round">
              <path d="M60 120 h264 c16 0 30 14 30 30 v192 c0 16-14 30-30 30 H60 c-16 0-30-14-30-30 V150 c0-16 14-30 30-30 z" />
              <path d="M100 120 V80 c0-12 10-22 22-22 h140 c12 0 22 10 22 22 v40" />
              <path d="M240 210 h114 c12 0 22 10 22 22 v40 c0 12-10 22-22 22 H240 c-12 0-22-10-22-22 v-40 c0-12 10-22 22-22 z" fill="#7C2D3E" />
              <circle cx="270" cy="252" r="10" fill="#FDFAF3" stroke="none" />
            </g>
          </svg>
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
