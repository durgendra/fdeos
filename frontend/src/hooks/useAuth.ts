import { useCallback, useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { TOKEN_KEY } from '../api/client';
import { ApiUser, EffectiveSession } from '../types/api';

export function useAuth(enabled: boolean) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<ApiUser | null>(null);
  const [session, setSession] = useState<EffectiveSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    if (!enabled || !localStorage.getItem(TOKEN_KEY)) return;
    setLoading(true);
    setError(null);
    try {
      const effective = await authApi.effectiveSession();
      setSession(effective);
      setUser(effective.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load session');
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession, token]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    await refreshSession();
    return response;
  };

  const register = async (body: { name: string; email: string; password: string; organizationName: string }) => {
    const response = await authApi.register(body);
    localStorage.setItem(TOKEN_KEY, response.token);
    setToken(response.token);
    await refreshSession();
    return response;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setSession(null);
  };

  return { token, user, session, loading, error, login, register, logout, refreshSession };
}
