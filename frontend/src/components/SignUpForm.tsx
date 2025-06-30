// src/components/SignUpForm.tsx
import React, { useState } from 'react'; // Removido useEffect
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { cpf as cpfValidator } from 'cpf-cnpj-validator';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Adicione este import no topo do arquivo
import axios from 'axios'; // Adicione ou descomente este import

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001'; // Garanta que a URL base da API esteja definida
// Funções de máscara (CPF e Celular mantidas)
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

// Novo FormInputs sem endereço, com email
type FormInputs = {
    nome: string;
    sobrenome: string;
    email: string; // Adicionado Email
    cpf: string;
    celular: string;
    senha: string;
    confirmarSenha: string;
};

const SignUpForm: React.FC = () => {
    const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>({
        mode: 'onBlur'
    });
     const navigate = useNavigate(); // Adicione esta linha
    const [apiError, setApiError] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const senhaValue = watch('senha');

    // Lógica de busca de CEP foi removida

     const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setApiError('');
        try {
          // A senha é enviada, o backend cuidará dela
          const { confirmarSenha, ...payload } = data; // Remove a confirmação de senha do payload
          await axios.post(`${API_BASE_URL}/api/auth/email-password-signup`, payload);
          alert('Cadastro realizado com sucesso! Agora você pode fazer o login.');
          navigate('/login'); // Redireciona para a página de login
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            setApiError(error.response.data.message || 'Erro ao cadastrar.');
          } else {
            setApiError('Ocorreu um erro. Tente novamente.');
          }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            {apiError && <p className="error-message">{apiError}</p>}

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

            <div className="form-group"> {/* Email agora ocupa uma linha inteira, ou pode ser colocado num form-row */}
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

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cpf">CPF:</label>
                    <Controller
                        name="cpf"
                        control={control}
                        rules={{
                            required: 'CPF é obrigatório',
                            validate: (value) => cpfValidator.isValid(value) || 'CPF inválido.',
                            pattern: {
                                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                message: 'Formato esperado: XXX.XXX.XXX-XX'
                            }
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
                        <button
                            type="button"
                            className="password-toggle-button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
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
                        <button
                            type="button"
                            className="password-toggle-button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmarSenha && <p className="input-error-message">{errors.confirmarSenha.message}</p>}
                </div>
            </div>

            {/* Campos de endereço removidos daqui */}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
            </button>
        </form>
    );
};

export default SignUpForm;