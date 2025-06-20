// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userToken: string | null;
  login: (token: string) => void;
  logout: (callback?: () => void) => void; // <--- MODIFIED: Added optional callback
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setUserToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setUserToken(token);
    setIsAuthenticated(true);
  };

  const logout = (callback?: () => void) => { // <--- MODIFIED: Added optional callback
    localStorage.removeItem('authToken');
    setUserToken(null);
    setIsAuthenticated(false);
    if (callback) {
      callback(); // Execute the callback if provided
    } else {
      window.location.href = '/login'; // Default redirect if no callback
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};