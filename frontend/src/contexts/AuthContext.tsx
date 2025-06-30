// src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Interface para os dados do usuário extraídos do token
interface UserPayload {
  uid: string;
  email: string;
  name: string | null;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  userToken: string | null;
  user: UserPayload | null;
  login: (token: string) => void;
  logout: (callback?: () => void) => void;
}

// 1. Crie o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Crie o Provedor (AuthProvider)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      processToken(token);
    }
  }, []);

  const processToken = (token: string) => {
    try {
      const decoded = jwtDecode<UserPayload>(token);
      setUserToken(token);
      setUser(decoded);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      logout();
    }
  };

  const login = (token: string) => {
    processToken(token);
  };

  const logout = (callback?: () => void) => {
    localStorage.removeItem('authToken');
    setUserToken(null);
    setUser(null);
    if (callback) callback();
  };

  const value = {
    isAuthenticated: !!userToken,
    userToken,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Crie e exporte o Hook (useAuth) como uma exportação nomeada
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};