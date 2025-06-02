// src/pages/LoginPage.tsx
import React from 'react';
import LoginForm from '../components/LoginForm.tsx'; // Criaremos este componente a seguir

const LoginPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div>
        <h2>Login</h2>
        <LoginForm />
        <p>
          Não tem uma conta? <a href="/signup">Cadastre-se</a>
        </p>
        <p>
          <a href="/forgot-password">Esqueceu sua senha?</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;