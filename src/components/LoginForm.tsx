// src/components/LoginForm.tsx
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      setIsLoading(false);
      return;
    }

    try {
      // --- Lógica de Autenticação ---
      // Aqui você faria a chamada para sua API de backend
      // Exemplo:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });

      // const data = await response.json();

      // if (!response.ok) {
      //   throw new Error(data.message || 'Falha no login');
      // }

      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login bem-sucedido com:', { email, password });
      // Se o login for bem-sucedido:
      // 1. Armazene o token de autenticação (ex: no localStorage ou Context API)
      // 2. Redirecione o usuário para a página principal
      // Ex: window.location.href = '/dashboard'; (ou usando React Router)

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
          aria-describedby={error && email === '' ? 'email-error' : undefined}
        />
        {error && email === '' && <span id="email-error" style={{ color: 'red', fontSize: '0.8rem' }}>Email é obrigatório</span>}
      </div>
      <div>
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '0.5rem' }}
          aria-describedby={error && password === '' ? 'password-error' : undefined}
        />
        {error && password === '' && <span id="password-error" style={{ color: 'red', fontSize: '0.8rem' }}>Senha é obrigatória</span>}
      </div>
      <button type="submit" disabled={isLoading} style={{ padding: '0.75rem' }}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;