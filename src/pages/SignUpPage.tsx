// src/pages/SignUpPage.tsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importar Link
import SignUpForm from '../components/SignUpForm';

const SignUpPage: React.FC = () => {
  return (
    <div className="login-page-container">
      <div className="login-box signup-box">
        <h2>Criar Conta</h2>
        <SignUpForm />
        <p style={{ marginTop: '20px' }}>
          Já tem uma conta? <Link to="/login">Faça login</Link> {/* Usar Link */}
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;