import { useState } from 'react';
import { authApi } from '../api/client';
import { useAuthContext } from '../context/AuthContext';
import type { AuthMode } from '../types';

export function useAuth() {
  const { setAuth, logout } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (mode: AuthMode, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const fn = mode === 'login' ? authApi.login : authApi.register;
      const data = await fn(email, password);
      setAuth(data.token, data.user);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submit, logout, loading, error, clearError: () => setError(null) };
}
