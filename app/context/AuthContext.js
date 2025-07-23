'use client';
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await fetch('http://localhost:5050/api/auth/me', {
        credentials: 'include', // required to send cookies
      });

      const data = await res.json();
      console.log('[CHECK_AUTH]', data);

      if (!res.ok) {
        setUser(null);
        return;
      }

      setUser(data.user);
    } catch (err) {
      console.error('[CHECK_AUTH ERROR]', err);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
