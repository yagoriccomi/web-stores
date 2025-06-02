// src/components/LoginForm.tsx
import React, { useState } from 'react';
// Se você for usar o AuthContext para redirecionar ou guardar o token:
// import { useAuth } from '../contexts/AuthContext';
// import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>(''); //
  const [password, setPassword] = useState<string>(''); //
  const [error, setError] = useState<string>(''); //
  const [isLoading, setIsLoading] = useState<boolean>(false); //

  // const auth = useAuth(); // Exemplo para usar o contexto de autenticação
  // const navigate = useNavigate(); // Exemplo para navegação

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { //
    event.preventDefault(); //
    setError(''); //
    setIsLoading(true); //

    // Validação básica
    if (!email || !password) { //
      setError('Por favor, preencha todos os campos.'); //
      setIsLoading(false); //
      return; //
    }

    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000)); //
      console.log('Login bem-sucedido com:', { email, password }); //
      // Se o login for bem-sucedido:
      // 1. Chame auth.login(tokenDaApi) se estiver usando AuthContext
      // 2. Redirecione o usuário: navigate('/dashboard'); se estiver usando React Router

    } catch (err) {
      if (err instanceof Error) { //
        setError(err.message); //
      } else {
        setError('Ocorreu um erro desconhecido.'); //
      }
    } finally {
      setIsLoading(false); //
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form"> {/* Aplicando classe CSS */}
      {error && <p className="error-message">{error}</p>} {/* Aplicando classe CSS */}
      <div className="form-group"> {/* Aplicando classe CSS */}
        <label htmlFor="email">Email:</label> {/* */}
        <input
          type="email" //
          id="email" //
          value={email} //
          onChange={(e) => setEmail(e.target.value)} //
          required //
        />
        {/* Se você quiser erros por campo, precisaria de uma lógica mais elaborada ou uma biblioteca como React Hook Form */}
        {/* Ex: {fieldErrors.email && <span className="input-error-message">{fieldErrors.email}</span>} */}
      </div>
      <div className="form-group"> {/* Aplicando classe CSS */}
        <label htmlFor="password">Senha:</label> {/* */}
        <input
          type="password" //
          id="password" //
          value={password} //
          onChange={(e) => setPassword(e.target.value)} //
          required //
        />
      </div>
      <button type="submit" disabled={isLoading}> {/* */}
        {isLoading ? 'Entrando...' : 'Entrar'} {/* */}
      </button>
    </form>
  );
};

export default LoginForm;