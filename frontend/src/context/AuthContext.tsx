import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthContextValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const auth = useAuth(enabled);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuthContext must be used inside AuthProvider');
  return value;
}
