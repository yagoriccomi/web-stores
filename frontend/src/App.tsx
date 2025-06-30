// src/App.tsx
import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // <<<--- ADICIONE/VERIFIQUE ESTA LINHA
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';
import { SearchProvider } from './contexts/SearchContext';
import AdminProductRegistrationPage from './pages/AdminProductRegistrationPage'; // <<<--- ADICIONE ESTA LINHA

// import './pages/ProductsPage.css'; // O CSS específico da página já está importado em ProductsPage.tsx

// ... (DashboardPage e ProtectedRoute como definidos anteriormente) ...
const DashboardPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', minHeight: 'calc(100vh - 200px)' }}>
      <h2>Dashboard</h2>
      <p>Bem-vindo! Você está logado.</p>
      <button
        onClick={() => auth.logout(() => navigate('/login'))}
        style={{ padding: '10px 20px', background: '#fd7e14', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Sair
      </button>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  //const { isAuthenticated } = useAuth();
  //if (!isAuthenticated) {
  //  return <Navigate to="/login" replace />;
  //}
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <div className="app-layout">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<ProductsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route
                    path="/profile"
                    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                  />
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                  />
                  <Route
                    path="/cart"
                    element={
                      <div style={{ padding: '20px', textAlign: 'center', minHeight: 'calc(100vh - 200px)' }}>Página do Carrinho (Em construção)</div>
                    }
                  />
                  <Route
                    path="/admin/add-product"
                    element={
                      <ProtectedRoute>
                        <AdminProductRegistrationPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<div style={{ padding: '20px', textAlign: 'center' }}>Página Sobre Nós (Placeholder)</div>} />
                  <Route path="/faq" element={<div style={{ padding: '20px', textAlign: 'center' }}>Página FAQ (Placeholder)</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;