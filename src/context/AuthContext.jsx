import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loginUser, registerUser } from '../services/auth.js';
import { decodeJwt } from '../services/token.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      const decoded = decodeJwt(token);
      if (decoded && decoded.sub) {
        const role = decoded.role || decoded.authorities || decoded.roles;
        const normalizedRole = Array.isArray(role) ? role[0] : role;
        const userPayload = { username: decoded.sub, role: normalizedRole || user?.role || 'USER' };
        setUser(userPayload);
        localStorage.setItem('auth_user', JSON.stringify(userPayload));
      }
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setUser(null);
    }
  }, [token]);

  const login = async (payload) => {
    const response = await loginUser(payload);
    setToken(response.token);
    // Store user info directly from the API response (more reliable than JWT decode)
    const userPayload = { username: response.username, role: response.role };
    setUser(userPayload);
    localStorage.setItem('auth_user', JSON.stringify(userPayload));
    return response;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    return response;
  };

  const logout = () => {
    setToken(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
