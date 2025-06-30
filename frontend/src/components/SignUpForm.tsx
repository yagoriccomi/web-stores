// src/components/SignUpForm.tsx
import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// URL base da sua API (idealmente vinda de variáveis de ambiente)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// --- Funções de Máscara ---
const maskCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const maskCelular = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

// --- Tipagem dos Dados do Formulário ---
type FormInputs = {
    nome: string;
    sobrenome: string;
    email: string;
    cpf: string;
    celular: string;
    senha: string;
    confirmarSenha: string;
};

// --- Componente do Formulário ---
const SignUpForm: React.FC = () => {
    const { 
        register, 
        handleSubmit, 
        control, 
        watch, 
        formState: { errors, isSubmitting } 
    } = useForm<FormInputs>({
        mode: 'onBlur' // Valida os campos quando o usuário tira o foco deles
    });
    
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Observa o valor do campo de senha para validar a confirmação
    const senhaValue = watch('senha');

    /**
     * Função executada no envio do formulário.
     */
    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setApiError('');
        try {
          // Remove a confirmação de senha, pois não é necessária no backend
          const { confirmarSenha, ...payload } = data;
          
          // Envia os dados para a API
          await axios.post(`${API_BASE_URL}/api/auth/email-password-signup`, payload);
          
          alert('Cadastro realizado com sucesso! Agora você pode fazer o login.');
          navigate('/login'); // Redireciona para a página de login

        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            // Exibe o erro retornado pela API
            setApiError(error.response.data.message || 'Erro ao cadastrar.');
          } else {
            setApiError('Ocorreu um erro inesperado. Tente novamente.');
          }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {apiError && <p className="error-message">{apiError}</p>}

            {/* Nome e Sobrenome */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input id="nome" type="text" {...register('nome', { required: 'Nome é obrigatório' })} />
                    {errors.nome && <p className="input-error-message">{errors.nome.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="sobrenome">Sobrenome:</label>
                    <input id="sobrenome" type="text" {...register('sobrenome', { required: 'Sobrenome é obrigatório' })} />
                    {errors.sobrenome && <p className="input-error-message">{errors.sobrenome.message}</p>}
                </div>
            </div>

            {/* Email */}
            <div className="form-group">
                <label htmlFor="email-signup">Email:</label>
                <input
                    id="email-signup"
                    type="email"
                    {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: 'Email inválido'
                        }
                    })}
                    autoComplete="email"
                />
                {errors.email && <p className="input-error-message">{errors.email.message}</p>}
            </div>

            {/* CPF e Celular */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cpf">CPF:</label>
                    <Controller
                        name="cpf"
                        control={control}
                        rules={{
                            required: 'CPF é obrigatório',
                            validate: (value) => cpfValidator.isValid(value) || 'CPF inválido.',
                        }}
                        render={({ field }) => (
                            <input
                                id="cpf"
                                type="text"
                                {...field}
                                onChange={(e) => field.onChange(maskCPF(e.target.value))}
                                maxLength={14}
                                autoComplete="off"
                            />
                        )}
                    />
                    {errors.cpf && <p className="input-error-message">{errors.cpf.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="celular">Celular:</label>
                    <Controller
                        name="celular"
                        control={control}
                        rules={{
                            required: 'Celular é obrigatório',
                            pattern: {
                                value: /^\(\d{2}\) \d{5}-\d{4}$/,
                                message: 'Celular inválido. Formato: (XX) XXXXX-XXXX'
                            }
                        }}
                        render={({ field }) => (
                            <input
                                id="celular"
                                type="tel"
                                {...field}
                                onChange={(e) => field.onChange(maskCelular(e.target.value))}
                                maxLength={15}
                                autoComplete="tel"
                            />
                        )}
                    />
                    {errors.celular && <p className="input-error-message">{errors.celular.message}</p>}
                </div>
            </div>

            {/* Senha e Confirmar Senha */}
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="senha-signup">Senha:</label>
                    <div className="input-wrapper-with-icon">
                        <input
                            id="senha-signup"
                            type={showPassword ? "text" : "password"}
                            {...register('senha', {
                                required: 'Senha é obrigatória',
                                minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' },
                                maxLength: { value: 16, message: 'A senha deve ter no máximo 16 caracteres' },
                            })}
                            autoComplete="new-password"
                        />
                        <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.senha && <p className="input-error-message">{errors.senha.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmarSenha-signup">Confirmar Senha:</label>
                    <div className="input-wrapper-with-icon">
                        <input
                            id="confirmarSenha-signup"
                            type={showConfirmPassword ? "text" : "password"}
                            {...register('confirmarSenha', {
                                required: 'Confirmação de senha é obrigatória',
                                validate: value => value === senhaValue || 'As senhas não coincidem'
                            })}
                            autoComplete="new-password"
                        />
                        <button type="button" className="password-toggle-button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmarSenha && <p className="input-error-message">{errors.confirmarSenha.message}</p>}
                </div>
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
            </button>
        </form>
    );
};

export default SignUpForm;