import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem('telemed_token')) return setLoading(false);
    api('/auth/me').then(({ user: current }) => setUser(current)).catch(() => localStorage.removeItem('telemed_token')).finally(() => setLoading(false));
  }, []);
  const login = async (credentials) => { const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }); localStorage.setItem('telemed_token', result.token); setUser(result.user); };
  const register = async (payload) => { const result = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) }); localStorage.setItem('telemed_token', result.token); setUser(result.user); };
  const logout = () => { localStorage.removeItem('telemed_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
