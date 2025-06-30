// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { auth } from '../config/firebaseClientConfig'; // Configuração do cliente Firebase
import { useAuth as useAppAuth } from '../contexts/AuthContext'; // Hook de autenticação do app

// A URL base da sua API, vinda de variáveis de ambiente
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const LoginForm: React.FC = () => {
  // Estados para gerenciar os inputs, erros e carregamento
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hooks para navegação e para o contexto de autenticação do app
  const navigate = useNavigate();
  const { login } = useAppAuth();

  /**
   * Comunica-se com seu backend para validar o token do Firebase e criar uma sessão.
   * @param idToken - O token JWT fornecido pelo Firebase após um login bem-sucedido.
   * @param provider - O método de login usado ('google' or 'email').
   */
  const handleBackendLogin = async (idToken: string, provider: 'google' | 'email') => {
    const endpoint = provider === 'google' ? '/api/auth/google-signin' : '/api/auth/email-password-signin';
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { idToken });
      
      // Armazena o token de sessão retornado pelo backend no contexto global do app
      login(response.data.sessionToken);
      
      console.log('Backend respondeu:', response.data.message);

      // Redireciona o usuário para o dashboard após o login
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Erro na comunicação com o backend:', err);
      setError(err.response?.data?.message || 'Falha na comunicação com o servidor.');
    }
  };

  /**
   * Processa o fluxo de login com e-mail e senha.
   */
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Autentica com o Firebase
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const idToken = await user.getIdToken();
      
      // 2. Valida no backend
      await handleBackendLogin(idToken, 'email');

    } catch (err: any) {
      setError(err.message || "Erro desconhecido no login.");
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Processa o fluxo de login com a conta do Google.
   */
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
        // 1. Autentica com o Google via popup do Firebase
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        
        // 2. Valida no backend
        await handleBackendLogin(idToken, 'google');

    } catch (err: any) {
        setError(err.message || "Erro ao logar com Google.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-form">
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleEmailLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div style={{ margin: '1rem 0', textAlign: 'center' }}>Ou</div>
      
      <button onClick={handleGoogleLogin} disabled={loading} className="google-login-button">
        {loading ? 'Aguarde...' : 'Entrar com Google'}
      </button>
    </div>
  );
};

export default LoginForm;