// src/components/LoginFormWithReactHookForm.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string;
  password_field: string; // Nome diferente para evitar conflito com a variável 'password' do escopo
};

const LoginFormWithReactHookForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>();
  const [loginError, setLoginError] = useState<string>('');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoginError('');
    console.log('Dados do formulário:', data);
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login bem-sucedido com:', { email: data.email, password: data.password_field });
      // Lógica de autenticação aqui
    } catch (err) {
      if (err instanceof Error) {
        setLoginError(err.message);
      } else {
        setLoginError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } })}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        {errors.email && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password_field">Senha:</label>
        <input
          id="password_field"
          type="password"
          {...register('password_field', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres' } })}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        {errors.password_field && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password_field.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem' }}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginFormWithReactHookForm;