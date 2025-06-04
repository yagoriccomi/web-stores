// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import axios from 'axios'; // Para busca de CEP
import { useAuth } from '../contexts/AuthContext'; // Para verificar se está logado e obter dados (futuramente)

// Tipos para os formulários
type PersonalDataInputs = {
    nome: string;
    sobrenome: string;
    // email: string; // O email geralmente é o identificador, pode ser não editável ou editável com cuidado
    celular: string;
    cpf: string; // CPF geralmente não é editável
};

type AddressInputs = {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
};

// Funções de máscara (CEP, Celular)
const maskCelular = (value: string) => { /* ... (copiar de SignUpForm) ... */
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
};
const maskCEP = (value: string) => { /* ... (copiar de SignUpForm) ... */
    return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
};


const ProfilePage: React.FC = () => {
    const { userToken } = useAuth(); // Exemplo de como pegar o token, dados do usuário viriam de uma API

    // Estado para o formulário de dados pessoais
    const { register: registerPersonal, handleSubmit: handleSubmitPersonal, setValue: setValuePersonal, control: controlPersonal, formState: { errors: errorsPersonal, isSubmitting: isSubmittingPersonal } } = useForm<PersonalDataInputs>({ // <-- ADDED controlPersonal
        defaultValues: {
            nome: "Usuário",
            sobrenome: "Exemplo",
            celular: "(00) 00000-0000",
            cpf: "000.000.000-00"
        }
    });

    // Estado para o formulário de endereço
    const { register: registerAddress, handleSubmit: handleSubmitAddress, control: controlAddress, setValue: setValueAddress, watch: watchAddress, formState: { errors: errorsAddress, isSubmitting: isSubmittingAddress } } = useForm<AddressInputs>({
        defaultValues: {
            cep: "", rua: "", numero: "", complemento: "", bairro: "", cidade: "", estado: ""
        }
    });

    const [isCepLoading, setIsCepLoading] = useState<boolean>(false);
    const [apiErrorAddress, setApiErrorAddress] = useState<string>('');
    const cepValue = watchAddress('cep');

    // Efeito para buscar endereço pelo CEP (similar ao SignUpForm)
    useEffect(() => {
        const fetchAddress = async (cep: string) => {
            const cleanCep = cep.replace(/\D/g, '');
            if (cleanCep.length === 8) {
                setIsCepLoading(true);
                setApiErrorAddress('');
                try {
                    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
                    if (response.data.erro) {
                        setApiErrorAddress('CEP não encontrado.');
                        setValueAddress('rua', ''); setValueAddress('bairro', ''); setValueAddress('cidade', ''); setValueAddress('estado', '');
                    } else {
                        setValueAddress('rua', response.data.logradouro || '');
                        setValueAddress('bairro', response.data.bairro || '');
                        setValueAddress('cidade', response.data.localidade || '');
                        setValueAddress('estado', response.data.uf || '');
                    }
                } catch (error) { setApiErrorAddress('Erro ao buscar CEP.'); }
                finally { setIsCepLoading(false); }
            } else if (cleanCep.length === 0) {
                setValueAddress('rua', ''); setValueAddress('bairro', ''); setValueAddress('cidade', ''); setValueAddress('estado', ''); setApiErrorAddress('');
            }
        };
        if (cepValue) fetchAddress(cepValue);
        else { setValueAddress('rua', ''); setValueAddress('bairro', ''); setValueAddress('cidade', ''); setValueAddress('estado', ''); setApiErrorAddress('');}
    }, [cepValue, setValueAddress]);


    // Simulação de carregamento de dados do usuário
    useEffect(() => {
        if (userToken) {
            console.log("Usuário logado, buscaria dados do perfil e endereço da API.");
            // Exemplo: API.getUserProfile().then(data => {
            //   setValuePersonal('nome', data.nome);
            //   setValuePersonal('sobrenome', data.sobrenome);
            //   setValuePersonal('celular', maskCelular(data.celular));
            //   setValuePersonal('cpf', data.cpf); // CPF não editável
            //   setValueAddress('cep', maskCEP(data.address.cep));
            //   // ... preencher outros campos de endereço
            // });
        }
    }, [userToken, setValuePersonal, setValueAddress]);


    const onPersonalSubmit: SubmitHandler<PersonalDataInputs> = async (data) => {
        console.log('Dados Pessoais para salvar:', data);
        // Chamar API para salvar dados pessoais
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Dados pessoais salvos (simulação)!');
    };

    const onAddressSubmit: SubmitHandler<AddressInputs> = async (data) => {
        console.log('Endereço para salvar:', data);
        // Chamar API para salvar endereço
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Endereço salvo (simulação)!');
    };

    const handleRedefinePassword = () => {
        console.log("Botão Redefinir Senha clicado - Implementar fluxo.");
        alert("Você seria redirecionado para um fluxo de redefinição de senha (simulação).");
        // Ex: navigate('/forgot-password-flow');
    };

    return (
        <div className="login-page-container"> {/* Reutilizar container para centralizar */}
            <div className="login-box" style={{ maxWidth: '700px' }}> {/* Ajustar largura */}
                <h2>Meu Perfil</h2>

                <form onSubmit={handleSubmitPersonal(onPersonalSubmit)} className="login-form section-form">
                    <h3>Dados Pessoais</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="profile-nome">Nome:</label>
                            <input id="profile-nome" type="text" {...registerPersonal('nome', { required: 'Nome é obrigatório' })} />
                            {errorsPersonal.nome && <p className="input-error-message">{errorsPersonal.nome.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile-sobrenome">Sobrenome:</label>
                            <input id="profile-sobrenome" type="text" {...registerPersonal('sobrenome', { required: 'Sobrenome é obrigatório' })} />
                            {errorsPersonal.sobrenome && <p className="input-error-message">{errorsPersonal.sobrenome.message}</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-cpf">CPF: (Não editável)</label>
                        <input id="profile-cpf" type="text" {...registerPersonal('cpf')} readOnly style={{ backgroundColor: '#e9ecef' }} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-celular">Celular:</label>
                        <Controller
                            name="celular"
                            control={controlPersonal} // <--- CORRECTED to use controlPersonal
                            render={({ field }) => (
                                <input
                                    id="profile-celular"
                                    type="tel"
                                    {...field}
                                    onChange={(e) => field.onChange(maskCelular(e.target.value))}
                                    maxLength={15}
                                />
                            )}
                            rules={{ required: 'Celular é obrigatório', pattern: { value: /^\(\d{2}\) \d{5}-\d{4}$/, message: 'Celular inválido' } }}
                        />
                        {errorsPersonal.celular && <p className="input-error-message">{errorsPersonal.celular.message}</p>}
                    </div>
                    <button type="submit" disabled={isSubmittingPersonal}>
                        {isSubmittingPersonal ? 'Salvando...' : 'Salvar Dados Pessoais'}
                    </button>
                </form>

                <hr className="form-divider" />

                <form onSubmit={handleSubmitAddress(onAddressSubmit)} className="login-form section-form">
                    <h3>Endereço</h3>
                    {apiErrorAddress && <p className="error-message">{apiErrorAddress}</p>}
                    <div className="form-group">
                        <label htmlFor="profile-cep">CEP:</label>
                        <Controller
                            name="cep"
                            control={controlAddress}
                            rules={{ required: 'CEP é obrigatório', pattern: { value: /^\d{5}-\d{3}$/, message: 'CEP inválido' } }}
                            render={({ field }) => (
                                <input id="profile-cep" type="text" {...field} onChange={(e) => field.onChange(maskCEP(e.target.value))} maxLength={9} />
                            )}
                        />
                        {isCepLoading && <p className="cep-loading-message">Buscando CEP...</p>}
                        {errorsAddress.cep && <p className="input-error-message">{errorsAddress.cep.message}</p>}
                    </div>
                    {/* Outros campos de endereço: Rua, Número, Complemento, Bairro, Cidade, Estado */}
                    {/* (Estrutura similar ao SignUpForm anterior, usando registerAddress e errorsAddress) */}
                     <div className="form-row">
                        <div className="form-group" style={{ flexGrow: 2 }}>
                            <label htmlFor="profile-rua">Rua:</label>
                            <input id="profile-rua" type="text" {...registerAddress('rua', { required: 'Rua é obrigatória' })} />
                            {errorsAddress.rua && <p className="input-error-message">{errorsAddress.rua.message}</p>}
                        </div>
                        <div className="form-group" style={{ flexGrow: 1 }}>
                            <label htmlFor="profile-numero">Número:</label>
                            <input id="profile-numero" type="text" {...registerAddress('numero', { required: 'Número é obrigatório' })} />
                            {errorsAddress.numero && <p className="input-error-message">{errorsAddress.numero.message}</p>}
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-complemento">Complemento: (Opcional)</label>
                        <input id="profile-complemento" type="text" {...registerAddress('complemento')} />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="profile-bairro">Bairro:</label>
                            <input id="profile-bairro" type="text" {...registerAddress('bairro', { required: 'Bairro é obrigatório' })} />
                            {errorsAddress.bairro && <p className="input-error-message">{errorsAddress.bairro.message}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile-cidade">Cidade:</label>
                            <input id="profile-cidade" type="text" {...registerAddress('cidade', { required: 'Cidade é obrigatória' })} />
                            {errorsAddress.cidade && <p className="input-error-message">{errorsAddress.cidade.message}</p>}
                        </div>
                        <div className="form-group" style={{ flexBasis: '100px', flexGrow: 0 }}>
                            <label htmlFor="profile-estado">Estado:</label>
                            <input id="profile-estado" type="text" {...registerAddress('estado', { required: 'Estado é obrigatório' })} />
                            {errorsAddress.estado && <p className="input-error-message">{errorsAddress.estado.message}</p>}
                        </div>
                    </div>
                    <button type="submit" disabled={isSubmittingAddress || isCepLoading}>
                        {isSubmittingAddress ? 'Salvando...' : 'Salvar Endereço'}
                    </button>
                </form>

                <hr className="form-divider" />

                <div className="section-form">
                     <h3>Segurança</h3>
                    <button type="button" onClick={handleRedefinePassword} className="nav-button" style={{display: 'block', margin: '10px auto'}}>
                        Redefinir Senha
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;