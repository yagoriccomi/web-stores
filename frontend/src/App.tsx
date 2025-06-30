// web-stores/frontend/src/App.tsx
import React, { JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';
import { SearchProvider } from './contexts/SearchContext';
import AdminRoute from './components/AdminRoute'; // <-- ADICIONADO
import AddProductPage from './pages/admin/AddProductPage'; // <-- ADICIONADO


// ... (Componentes DashboardPage e ProtectedRoute permanecem os mesmos) ...
const DashboardPage: React.FC = () => { /* ...código existente... */ };
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => { /* ...código existente... */ };

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
                  {/* ROTA PRINCIPAL ADICIONADA */}
                  <Route path="/" element={<ProductsPage />} />

                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  
                  {/* Rotas Protegidas */}
                  <Route
                    path="/profile"
                    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
                  />
                  <Route
                    path="/dashboard"
                    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
                  />

                  {/* ROTA DE ADMIN */}
                  <Route
                    path="/admin/add-product"
                    element={<AdminRoute><AddProductPage /></AdminRoute>}
                  />

                  {/* Redirecionamento (Opcional, mas bom ter) */}
                  <Route path="*" element={<Navigate to="/" />} />
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