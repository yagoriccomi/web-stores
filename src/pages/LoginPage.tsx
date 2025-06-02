// src/pages/LoginPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import LoginForm from '../components/LoginForm'; // ou LoginFormWithReactHookForm
// import LoginFormWithReactHookForm from '../components/LoginFormWithReactHookForm';


const LoginPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <div className="login-box login-box-narrow">
        <h2>Login</h2>
        <LoginForm /> {/* Ou <LoginFormWithReactHookForm /> */}
        <p style={{ marginTop: '20px' }}>
          Não tem uma conta? <Link to="/signup">Cadastre-se</Link> {/* Usar Link */}
        </p>
        <p>
          {/* Se "Esqueceu sua senha?" for uma rota interna, use Link também */}
          <Link to="/forgot-password">Esqueceu sua senha?</Link> 
          {/* Se for externa ou não implementada ainda, pode manter <a> ou um # por enquanto */}
          {/* <a href="/forgot-password">Esqueceu sua senha?</a> */}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;