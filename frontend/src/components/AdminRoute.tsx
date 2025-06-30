// web-stores/frontend/src/components/AdminRoute.tsx
import React, { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    // Se não estiver logado, redireciona para o login
    return <Navigate to="/login" replace />;
  }

  if (!user?.roles.includes('admin')) {
    // Se estiver logado mas não for admin, redireciona para a home
    // Poderia ser uma página de "Acesso Negado" também
    alert('Acesso negado. Esta área é restrita para administradores.');
    return <Navigate to="/" replace />;
  }

  // Se for admin, renderiza o componente filho
  return children;
};

export default AdminRoute;