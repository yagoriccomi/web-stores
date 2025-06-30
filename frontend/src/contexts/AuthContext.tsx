// web-stores/frontend/src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- ADICIONADO

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
  user: UserPayload | null; // <-- ADICIONADO
  login: (token: string) => void;
  logout: (callback?: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserPayload | null>(null); // <-- ADICIONADO
  const isAuthenticated = !!userToken; // <-- MODIFICADO para ser mais direto

  // Função auxiliar para decodificar e definir o estado
  const processToken = (token: string) => {
    try {
      const decoded = jwtDecode<UserPayload>(token);
      setUserToken(token);
      setUser(decoded);
      localStorage.setItem('authToken', token);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      // Limpa estado se o token for inválido
      localStorage.removeItem('authToken');
      setUserToken(null);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      processToken(token);
    }
  }, []);

  const login = (token: string) => {
    processToken(token);
  };

  const logout = (callback?: () => void) => {
    localStorage.removeItem('authToken');
    setUserToken(null);
    setUser(null); // <-- ADICIONADO para limpar os dados do usuário
    if (callback) {
      callback();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userToken, user, login, logout }}>
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