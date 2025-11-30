// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

 
  const login = (userInfo, jwtToken) => {
    setUser(userInfo);
    setToken(jwtToken || 'dummy-token');

    localStorage.setItem('user', JSON.stringify(userInfo));
    localStorage.setItem('token', jwtToken || 'dummy-token');
  };

  
  const register = async (username, password) => {
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password, 
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Register failed');
    }

    
    await res.text();
    
  };

  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
