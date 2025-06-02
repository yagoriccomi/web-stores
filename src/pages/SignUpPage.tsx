// src/pages/SignUpPage.tsx
import React from 'react';
import SignUpForm from '../components/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <div className="login-page-container"> {/* Reutilizando a classe para centralizar */}
      <div className="login-box signup-box"> {/* Adiciona classe para largura do cadastro */}
        <h2>Criar Conta</h2>
        <SignUpForm />
        <p style={{ marginTop: '20px' }}>
          Já tem uma conta? <a href="/login">Faça login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;