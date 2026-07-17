import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { AuthMode } from '../types';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { submit, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(mode, email, password);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    clearError();
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <svg className="brand-logo" viewBox="0 0 512 512" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(64, 64)" fill="none" stroke="#7C2D3E" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round">
              <path d="M60 120 h264 c16 0 30 14 30 30 v192 c0 16-14 30-30 30 H60 c-16 0-30-14-30-30 V150 c0-16 14-30 30-30 z" />
              <path d="M100 120 V80 c0-12 10-22 22-22 h140 c12 0 22 10 22 22 v40" />
              <path d="M240 210 h114 c12 0 22 10 22 22 v40 c0 12-10 22-22 22 H240 c-12 0-22-10-22-22 v-40 c0-12 10-22 22-22 z" fill="#7C2D3E" />
              <circle cx="270" cy="252" r="10" fill="#FDFAF3" stroke="none" />
            </g>
          </svg>
          <h1 className="auth-title">Expense Tracker</h1>
        </div>
        <p className="auth-subtitle">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-row">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className="auth-switch-btn"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
