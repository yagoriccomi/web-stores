// src/components/LoginFormWithReactHookForm.tsx
import React, { useState } from 'react'; //
import { useForm, type SubmitHandler } from 'react-hook-form';

type Inputs = {
  email: string; //
  password_field: string; //
};

const LoginFormWithReactHookForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>(); //
  const [loginError, setLoginError] = useState<string>(''); //

  const onSubmit: SubmitHandler<Inputs> = async (data) => { //
    setLoginError(''); //
    console.log('Dados do formulário:', data); //
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulação
      console.log('Login bem-sucedido com:', { email: data.email, password: data.password_field }); //
      // Lógica de autenticação aqui
    } catch (err) {
      if (err instanceof Error) { //
        setLoginError(err.message); //
      } else {
        setLoginError('Ocorreu um erro desconhecido.'); //
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form"> {/* Classe aplicada */}
      {loginError && <p className="error-message">{loginError}</p>} {/* Classe para erro geral do formulário */}
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email" //
          type="email" //
          {...register('email', { required: 'Email é obrigatório', pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' } })} //
        />
        {errors.email && <p className="input-error-message">{errors.email.message}</p>} {/* Classe para erro específico do input */}
      </div>
      <div className="form-group">
        <label htmlFor="password_field">Senha:</label>
        <input
          id="password_field" //
          type="password" //
          {...register('password_field', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'A senha deve ter pelo menos 6 caracteres' } })} //
        />
        {errors.password_field && <p className="input-error-message">{errors.password_field.message}</p>} {/* Classe para erro específico do input */}
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginFormWithReactHookForm;