// src/components/SignUpForm.tsx
import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext'; // <-- 1. IMPORTAR O HOOK DE AUTENTICAÇÃO

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// --- Funções de Máscara (sem alterações) ---
const maskCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
const maskCelular = (value: string) => value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');

// --- Tipagem dos Dados do Formulário (sem alterações) ---
type FormInputs = {
    nome: string;
    sobrenome: string;
    email: string;
    cpf: string;
    celular: string;
    senha: string;
    confirmarSenha: string;
};

const SignUpForm: React.FC = () => {
    const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>({ mode: 'onBlur' });
    
    const navigate = useNavigate();
    const { login } = useAuth(); // <-- 2. OBTER A FUNÇÃO DE LOGIN DO CONTEXTO
    const [apiError, setApiError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const senhaValue = watch('senha');

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setApiError('');
        try {
          const { confirmarSenha, ...payload } = data;
          
          // Envia os dados para a API. 
          // O backend deve retornar o token de sessão no corpo da resposta após o cadastro.
          const response = await axios.post(`${API_BASE_URL}/api/auth/email-password-signup`, payload);
          
          // <-- 3. LÓGICA DE LOGIN AUTOMÁTICO
          const sessionToken = response.data.token; // Supondo que o backend retorna { token: '...' }
          if (sessionToken) {
            alert('Cadastro realizado com sucesso!');
            login(sessionToken); // Autentica o usuário na aplicação
            navigate('/dashboard'); // Redireciona para o painel, não para o login
          } else {
            // Caso o backend não retorne um token por algum motivo
             setApiError('Cadastro realizado, mas o login automático falhou. Por favor, faça o login manualmente.');
             navigate('/login');
          }

        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setApiError(error.response.data.message || 'Erro ao cadastrar.');
          } else {
            setApiError('Ocorreu um erro inesperado. Tente novamente.');
          }
        }
    };

    return (
        // O JSX do formulário permanece exatamente o mesmo
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
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Email inválido' }
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
                            <input id="cpf" type="text" {...field} onChange={(e) => field.onChange(maskCPF(e.target.value))} maxLength={14} autoComplete="off"/>
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
                            pattern: { value: /^\(\d{2}\) \d{5}-\d{4}$/, message: 'Celular inválido. Formato: (XX) XXXXX-XXXX' }
                        }}
                        render={({ field }) => (
                            <input id="celular" type="tel" {...field} onChange={(e) => field.onChange(maskCelular(e.target.value))} maxLength={15} autoComplete="tel" />
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
                                minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' }
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