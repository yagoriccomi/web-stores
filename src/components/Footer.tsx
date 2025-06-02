// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // <<<--- ADICIONE ESTA LINHA

const Footer: React.FC = () => {
  const auth = useAuth(); // Chame o hook aqui para usar suas propriedades

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <Link to="/">NOSSA TENDA</Link>
        </div>
        <div className="footer-sections">
          <div className="footer-section">
            <h4>SOBRE NÓS</h4>
            <ul>
              <li><Link to="/about">Nossa História</Link></li>
              <li><Link to="/team">Nossa Equipe</Link></li>
              <li><Link to="/careers">Carreiras</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>LINKS ÚTEIS</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">Termos de Serviço</Link></li>
              <li><Link to="/privacy">Política de Privacidade</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>MINHA CONTA</h4>
            <ul>
              {/* Agora usando a variável 'auth' que foi inicializada acima */}
              <li><Link to={auth.isAuthenticated ? "/profile" : "/login"}>Meu Perfil</Link></li>
              <li><Link to="/orders">Meus Pedidos</Link></li> {/* Esta rota não foi definida, precisará ser criada se usada */}
              <li><Link to="/settings">Configurações</Link></li> {/* Esta rota não foi definida */}
            </ul>
          </div>
          <div className="footer-section">
            <h4>REDES SOCIAIS</h4>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Youtube"><FaYoutube /></a>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} De Yago Riccomi. Feito com ❤️ para Você.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;