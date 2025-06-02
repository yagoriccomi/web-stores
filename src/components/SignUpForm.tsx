// src/components/SignUpForm.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'; // Corrigido import de SubmitHandler
import axios from 'axios';

// Funções de máscara (mantidas)
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

const maskCEP = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
};

type FormInputs = {
    nome: string;
    sobrenome: string;
    cpf: string;
    celular: string;
    senha: string;
    confirmarSenha: string;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
};

const SignUpForm: React.FC = () => {
    const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormInputs>({
        mode: 'onBlur'
    });
    const [apiError, setApiError] = useState<string>('');
    const [isCepLoading, setIsCepLoading] = useState<boolean>(false);

    const cepValue = watch('cep');
    const senhaValue = watch('senha');

    useEffect(() => {
        const fetchAddress = async (cep: string) => {
            const cleanCep = cep.replace(/\D/g, '');
            if (cleanCep.length === 8) {
                setIsCepLoading(true);
                setApiError('');
                try {
                    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    if (response.data.erro) {
                        setApiError('CEP não encontrado.');
                        setValue('rua', '');
                        setValue('bairro', '');
                        setValue('cidade', '');
                        setValue('estado', '');
                    } else {
                        setValue('rua', response.data.logradouro || '');
                        setValue('bairro', response.data.bairro || '');
                        setValue('cidade', response.data.localidade || '');
                        setValue('estado', response.data.uf || '');
                    }
                } catch (error) {
                    setApiError('Erro ao buscar CEP. Tente novamente.');
                } finally {
                    setIsCepLoading(false);
                }
            } else if (cleanCep.length === 0) { // Limpar campos se o CEP for apagado
                setValue('rua', '');
                setValue('bairro', '');
                setValue('cidade', '');
                setValue('estado', '');
                setApiError('');
            }
        };

        if (cepValue) {
            fetchAddress(cepValue);
        } else { // Limpar campos se cepValue for undefined ou null (ao carregar o formulário)
             setValue('rua', '');
             setValue('bairro', '');
             setValue('cidade', '');
             setValue('estado', '');
             setApiError('');
        }
    }, [cepValue, setValue]);

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setApiError('');
        console.log('Dados do formulário de cadastro:', data);
        // Simulação de envio
        await new Promise(resolve => setTimeout(resolve, 1000));
        // alert('Cadastro realizado com sucesso!'); // Exemplo
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

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cpf">CPF:</label>
                    <Controller
                        name="cpf"
                        control={control}
                        rules={{
                            required: 'CPF é obrigatório',
                            pattern: {
                                value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
                                message: 'CPF inválido. Formato: XXX.XXX.XXX-XX'
                            }
                        }}
                        render={({ field }) => (
                            <input
                                id="cpf"
                                type="text" // Use type="text" para inputs com máscara
                                {...field}
                                onChange={(e) => field.onChange(maskCPF(e.target.value))}
                                maxLength={14}
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
                                type="tel" // Use type="tel" para semântica
                                {...field}
                                onChange={(e) => field.onChange(maskCelular(e.target.value))}
                                maxLength={15}
                            />
                        )}
                    />
                    {errors.celular && <p className="input-error-message">{errors.celular.message}</p>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="senha">Senha:</label>
                    <input
                        id="senha"
                        type="password"
                        {...register('senha', {
                            required: 'Senha é obrigatória',
                            minLength: { value: 8, message: 'A senha deve ter no mínimo 8 caracteres' },
                            maxLength: { value: 16, message: 'A senha deve ter no máximo 16 caracteres' },
                            // Removido pattern para simplificar, adicione se necessário uma regex mais complexa
                            // pattern: {
                            // value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/,
                            // message: 'A senha deve conter letras e números (8-16 caracteres).'
                            // }
                        })}
                    />
                    {errors.senha && <p className="input-error-message">{errors.senha.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="confirmarSenha">Confirmar Senha:</label>
                    <input
                        id="confirmarSenha"
                        type="password"
                        {...register('confirmarSenha', {
                            required: 'Confirmação de senha é obrigatória',
                            validate: value => value === senhaValue || 'As senhas não coincidem'
                        })}
                    />
                    {errors.confirmarSenha && <p className="input-error-message">{errors.confirmarSenha.message}</p>}
                </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '10px 0' }} /> {/* Separador visual */}

            <div className="form-group"> {/* CEP ocupa a linha toda */}
                <label htmlFor="cep">CEP:</label>
                <Controller
                    name="cep"
                    control={control}
                    rules={{
                        required: 'CEP é obrigatório',
                        pattern: {
                            value: /^\d{5}-\d{3}$/,
                            message: 'CEP inválido. Formato: XXXXX-XXX'
                        }
                    }}
                    render={({ field }) => (
                        <input
                            id="cep"
                            type="text"
                            {...field}
                            onChange={(e) => field.onChange(maskCEP(e.target.value))}
                            maxLength={9}
                        />
                    )}
                />
                {isCepLoading && <p className="cep-loading-message">Buscando CEP...</p>}
                {errors.cep && <p className="input-error-message">{errors.cep.message}</p>}
            </div>

            <div className="form-row">
                <div className="form-group" style={{ flexGrow: 2 }}> {/* Rua pode ser maior */}
                    <label htmlFor="rua">Rua:</label>
                    <input id="rua" type="text" {...register('rua', { required: 'Rua é obrigatória' })} />
                    {errors.rua && <p className="input-error-message">{errors.rua.message}</p>}
                </div>
                <div className="form-group" style={{ flexGrow: 1 }}>
                    <label htmlFor="numero">Número Residencial:</label>
                    <input id="numero" type="text" {...register('numero', { required: 'Número é obrigatório' })} />
                    {errors.numero && <p className="input-error-message">{errors.numero.message}</p>}
                </div>
            </div>
            
            <div className="form-group"> {/* Complemento ocupa a linha toda */}
                <label htmlFor="complemento">Complemento: (Opcional)</label>
                <input id="complemento" type="text" {...register('complemento')} />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="bairro">Bairro:</label>
                    <input id="bairro" type="text" {...register('bairro', { required: 'Bairro é obrigatório' })} /> {/* Corrigido para 'obrigatório' */}
                    {errors.bairro && <p className="input-error-message">{errors.bairro.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="cidade">Cidade:</label>
                    <input id="cidade" type="text" {...register('cidade', { required: 'Cidade é obrigatória' })} />
                    {errors.cidade && <p className="input-error-message">{errors.cidade.message}</p>}
                </div>
                <div className="form-group" style={{ flexBasis: '100px', flexGrow: 0 }}> {/* Estado menor */}
                    <label htmlFor="estado">Estado:</label>
                    <input id="estado" type="text" {...register('estado', { required: 'Estado é obrigatório' })} />
                    {errors.estado && <p className="input-error-message">{errors.estado.message}</p>}
                </div>
            </div>

            <button type="submit" disabled={isSubmitting || isCepLoading}>
                {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
            </button>
        </form>
    );
};

export default SignUpForm;