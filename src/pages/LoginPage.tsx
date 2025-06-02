// src/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../components/LoginForm.tsx'; //

const LoginPage: React.FC = () => {
  return (
    <div className="login-page-container"> {/* Aplicando classe CSS */}
      <div className="login-box login-box-narrow"> {/* Adiciona classe para largura do login */}
        <h2>Login</h2> {/* */}
        <LoginForm /> {/* */}
        <p>
          Não tem uma conta? <a href="/signup">Cadastre-se</a> {/* */}
        </p>
        <p>
          <a href="/forgot-password">Esqueceu sua senha?</a> {/* */}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;