// src/components/Header.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext'; // Importar useSearch
import { FaShoppingCart, FaSearch } from 'react-icons/fa';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const { searchTerm, setSearchTerm } = useSearch(); // Usar o hook de pesquisa
  const navigate = useNavigate();
  const itemCount = getCartItemCount();

  const handleLogout = () => {
    logout(() => navigate('/login'));
  };

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

        <div className="header-actions-right">
          <Link to="/cart" className={`cart-icon-wrapper ${itemCount > 0 ? 'active' : ''}`} aria-label={`Carrinho com ${itemCount} itens`}>
            <FaShoppingCart className={`cart-icon ${itemCount > 0 ? 'active' : ''}`} />
            {itemCount > 0 && (
              <span className="cart-notification-badge">{itemCount > 9 ? '9+' : itemCount}</span>
            )}
          </Link>
          <div className="user-actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="nav-button logout-button">
                  Sair
                </button>
              </>
            ) : (
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