import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../config/firebaseClientConfig';
import { useAuth as useAppAuth } from '../contexts/AuthContext'; // Renomeando para evitar conflito

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAppAuth();

  const handleBackendLogin = async (idToken: string, provider: 'google' | 'email') => {
    const endpoint = provider === 'google' ? '/api/auth/google-signin' : '/api/auth/email-password-signin';
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { idToken });
      
      login(response.data.sessionToken);
      
      console.log('Backend respondeu:', response.data.message);

      // --- ESTA É A LINHA A SER CORRIGIDA ---
      // Original:
      // navigate('/frontend/index.html');
      
      // CORREÇÃO: Redirecione para uma rota válida do React Router
      navigate('/dashboard'); // Ou para '/profile' ou para '/'
      
    } catch (err: any) {
      console.error('Erro na comunicação com o backend:', err);
      setError(err.response?.data?.message || 'Falha na comunicação com o servidor.');
    }
};

  const processLogin = async (loginPromise: Promise<UserCredential>) => {
    setLoading(true);
    setError('');
    try {
      const result = await loginPromise;
      const user = result.user;
      const idToken = await user.getIdToken();
      await handleBackendLogin(idToken, 'email');
    } catch (err: any) {
      // Tratar erros do Firebase Auth
      setError(err.message || "Erro desconhecido no login.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    processLogin(signInWithEmailAndPassword(auth, email, password));
  };
  
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
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
      <button onClick={handleGoogleLogin} disabled={loading} style={{backgroundColor: '#4285F4'}}>
          {loading ? 'Aguarde...' : 'Entrar com Google'}
      </button>
    </div>
  );
};

export default LoginForm;