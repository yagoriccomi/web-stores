// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Import useAuth
import './index.css'; // Certifique-se que o CSS global está aqui ou em main.tsx

// Um componente para simular uma página de Dashboard (protegida)
const DashboardPage: React.FC = () => {
  const auth = useAuth();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Dashboard</h2>
      <p>Bem-vindo! Você está logado.</p>
      <button onClick={() => auth.logout()} style={{ padding: '10px 20px', background: '#fd7e14', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Sair
      </button>
    </div>
  );
};

// Componente para Rotas Protegidas
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota principal e rota /login levam para LoginPage */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Exemplo de rota protegida */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Rota raiz redireciona para /login ou /dashboard dependendo da autenticação */}
          <Route
            path="/"
            element={
              // Se precisar de lógica para redirecionar autenticado para dashboard:
              // const { isAuthenticated } = useAuth(); // Isso precisaria estar num componente filho do AuthProvider
              // return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
              // Por simplicidade, vamos sempre para /login como raiz se não logado
              <Navigate to="/login" replace />
            }
          />
          
          {/* Adicione uma rota curinga para páginas não encontradas, se desejar */}
          {/* <Route path="*" element={<div>Página não encontrada</div>} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;