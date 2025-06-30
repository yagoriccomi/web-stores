// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { FaShoppingCart, FaSearch, FaUserShield } from 'react-icons/fa';

const Header: React.FC = () => {
  // Hooks para obter dados de autenticação, carrinho e pesquisa
  const { isAuthenticated, logout, user } = useAuth();
  const { getCartItemCount } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const itemCount = getCartItemCount();

  // Função para realizar o logout do usuário
  const handleLogout = () => {
    logout(() => navigate('/login'));
  };

  // Verifica se o usuário tem a função 'admin' (de forma segura, evitando erros se 'user' ou 'roles' for nulo)
  const isAdmin = user?.roles?.includes('admin');

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">NOSSA TENDA</Link>
        </div>

        {/* Barra de Pesquisa Centralizada */}
        <div className="search-bar-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="O que está procurando?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Ações do Cabeçalho à Direita (Carrinho e Usuário) */}
        <div className="header-actions-right">
          <Link to="/cart" className={`cart-icon-wrapper ${itemCount > 0 ? 'active' : ''}`} aria-label={`Carrinho com ${itemCount} itens`}>
            <FaShoppingCart className={`cart-icon ${itemCount > 0 ? 'active' : ''}`} />
            {itemCount > 0 && (
              <span className="cart-notification-badge">{itemCount > 9 ? '9+' : itemCount}</span>
            )}
          </Link>
          
          <div className="user-actions">
            {isAuthenticated ? (
              // Links para usuário LOGADO
              <>
                {isAdmin && (
                  <Link to="/admin/add-product" className="nav-link" title="Painel do Administrador">
                      <FaUserShield style={{ marginRight: '5px' }}/> Admin
                  </Link>
                )}
                <Link to="/profile" className="nav-link">Meu Perfil</Link>
                <button onClick={handleLogout} className="nav-button logout-button">
                  Sair
                </button>
              </>
            ) : (
              // Links para usuário DESLOGADO
              <>
                <Link to="/login" className="nav-link login-link">Login</Link>
                <Link to="/signup" className="nav-button signup-button">Cadastre-se</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;