// src/App.tsx
import React, { useState, useContext, createContext, JSX, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';

// --- CONTEXTOS (MOCK) ---
// Normalmente, estes estariam em arquivos separados (ex: ./contexts/AuthContext.tsx)

// AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; role: 'user' | 'admin' } | null;
  login: (callback: () => void) => void;
  logout: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType>(null!);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Simula um usuário. Em uma aplicação real, viria de uma API.
  const [user, setUser] = useState<{ name: string; role: 'user' | 'admin' } | null>(null);

  const login = (callback: () => void) => {
    setIsAuthenticated(true);
    setUser({ name: 'Usuário Admin', role: 'admin' }); // Simula um login de admin para teste
    callback();
  };

  const logout = (callback: () => void) => {
    setIsAuthenticated(false);
    setUser(null);
    callback();
  };

  const value = { isAuthenticated, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

// CartContext e SearchContext (Placeholders)
const CartProvider = ({ children }: { children: ReactNode }) => <>{children}</>;
const SearchProvider = ({ children }: { children: ReactNode }) => <>{children}</>;


// --- COMPONENTES DE ROTA (MOCK) ---
// Normalmente, estes estariam em arquivos separados (ex: ./components/ProtectedRoute.tsx)

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    // Redireciona para a página de login, salvando a localização atual
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user?.role !== 'admin') {
    // Se não for admin, redireciona para a página inicial
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- COMPONENTES DE LAYOUT (MOCK) ---
// Normalmente, estes estariam em arquivos separados (ex: ./components/Header.tsx)

const Header = () => (
  <header style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center' }}>
    <h1>Loja Virtual</h1>
    <nav>
      <Link to="/" style={{ color: 'white', margin: '0 10px' }}>Produtos</Link>
      <Link to="/admin/add-product" style={{ color: 'white', margin: '0 10px' }}>Admin Add Produto</Link>
      <Link to="/profile" style={{ color: 'white', margin: '0 10px' }}>Perfil</Link>
      <Link to="/login" style={{ color: 'white', margin: '0 10px' }}>Login</Link>
    </nav>
  </header>
);

const Footer = () => (
  <footer style={{ background: '#333', color: 'white', padding: '1rem', textAlign: 'center', marginTop: 'auto' }}>
    <p>© 2025 Loja Virtual. Todos os direitos reservados.</p>
  </footer>
);

// --- PÁGINAS (MOCK) ---
// Normalmente, estariam em arquivos separados na pasta ./pages/

const PageWrapper = ({ title, children }: { title: string, children?: ReactNode }) => (
    <div style={{ padding: '20px', textAlign: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <h2>{title}</h2>
        {children}
    </div>
);

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    return <PageWrapper title="Página de Login"><button onClick={() => login(() => navigate('/dashboard'))}>Logar como Admin</button></PageWrapper>;
};
const SignUpPage = () => <PageWrapper title="Página de Cadastro" />;
const ProfilePage = () => <PageWrapper title="Página de Perfil" />;
const ProductsPage = () => <PageWrapper title="Página de Produtos" />;
const AddProductPage = () => <PageWrapper title="Adicionar Novo Produto (Admin)" />;

const DashboardPage: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  return (
    <PageWrapper title="Dashboard">
      <p>Bem-vindo, {auth.user?.name}! Você está logado.</p>
      <button
        onClick={() => auth.logout(() => navigate('/login'))}
        style={{ padding: '10px 20px', background: '#fd7e14', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Sair
      </button>
    </PageWrapper>
  );
};

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header />
              <main style={{ flex: '1' }}>
                <Routes>
                  {/* Rotas Públicas */}
                  <Route path="/" element={<ProductsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/about" element={<PageWrapper title="Página Sobre Nós (Em construção)" />} />
                  <Route path="/faq" element={<PageWrapper title="Página FAQ (Em construção)" />} />

                  {/* Rotas Protegidas para Usuários Autenticados */}
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><PageWrapper title="Página do Carrinho (Em construção)" /></ProtectedRoute>} />

                  {/* Rota Protegida para Administradores */}
                  <Route path="/admin/add-product" element={<AdminRoute><AddProductPage /></AdminRoute>} />

                  {/* Redirecionamento */}
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
