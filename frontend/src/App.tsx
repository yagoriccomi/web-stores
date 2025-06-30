// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Importe seus provedores de contexto REAIS
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SearchProvider } from './contexts/SearchContext';

// 2. Importe seus componentes de layout REAIS
import Header from './components/Header';
import Footer from './components/Footer';

// 3. Importe suas páginas REAIS
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AddProductPage from './pages/admin/AddProductPage'; // Usando a página de admin correta
// import DashboardPage from './pages/DashboardPage'; // Supondo que você tenha ou queira criar esta página

// 4. Importe os componentes de rota protegida
import AdminRoute from './components/AdminRoute';

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  return (
    // Envolva a aplicação com os provedores REAIS
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          {/* Adicionei a correção para os avisos do Router aqui */}
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="app-layout">
              <Header />
              <main className="main-content">
                <Routes>
                  {/* === Rotas Públicas === */}
                  <Route path="/" element={<ProductsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/about" element={<div style={{ padding: '20px', textAlign: 'center' }}>Página Sobre Nós (Em construção)</div>} />
                  <Route path="/faq" element={<div style={{ padding: '20px', textAlign: 'center' }}>Página FAQ (Em construção)</div>} />

                  <Route path="/admin/add-product" element={<AdminRoute><AddProductPage /></AdminRoute>} />

                  {/* Rota para senhas e redirecionamento final */}
                  <Route path="/forgot-password" element={<div style={{ padding: '20px', textAlign: 'center' }}>Página de Recuperar Senha (Em construção)</div>} />
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
