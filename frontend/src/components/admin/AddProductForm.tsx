// web-stores/frontend/src/components/admin/AddProductForm.tsx
import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ProductInputs = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: FileList;
};

const AddProductForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProductInputs>();
  const { userToken } = useAuth();
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  const onSubmit: SubmitHandler<ProductInputs> = async (data) => {
    setApiError('');
    setApiSuccess('');

    if (!data.image || data.image.length === 0) {
      setApiError('Por favor, selecione uma imagem para o produto.');
      return;
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('category', data.category);
    formData.append('stock', String(data.stock));
    formData.append('image', data.image[0]);

    try {
      await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userToken}`,
        },
      });
      setApiSuccess('Produto cadastrado com sucesso!');
      reset(); // Limpa o formulário
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setApiError(error.response.data.message || 'Erro ao cadastrar o produto.');
      } else {
        setApiError('Ocorreu um erro inesperado.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      {apiError && <p className="error-message">{apiError}</p>}
      {apiSuccess && <p style={{ color: 'green', marginBottom: '15px' }}>{apiSuccess}</p>}

      <div className="form-group">
        <label htmlFor="name">Nome do Produto:</label>
        <input id="name" {...register('name', { required: 'Nome é obrigatório' })} />
        {errors.name && <p className="input-error-message">{errors.name.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Descrição:</label>
        <textarea id="description" {...register('description', { required: 'Descrição é obrigatória' })} rows={4}></textarea>
        {errors.description && <p className="input-error-message">{errors.description.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Preço (ex: 99.90):</label>
          <input id="price" type="number" step="0.01" {...register('price', { required: 'Preço é obrigatório', valueAsNumber: true, min: { value: 0.01, message: "Preço deve ser positivo."} })} />
          {errors.price && <p className="input-error-message">{errors.price.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="stock">Estoque:</label>
          <input id="stock" type="number" {...register('stock', { required: 'Estoque é obrigatório', valueAsNumber: true, min: { value: 0, message: "Estoque não pode ser negativo."} })} />
          {errors.stock && <p className="input-error-message">{errors.stock.message}</p>}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Categoria:</label>
        <input id="category" {...register('category', { required: 'Categoria é obrigatória' })} />
        {errors.category && <p className="input-error-message">{errors.category.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="image">Imagem do Produto:</label>
        <input id="image" type="file" accept="image/*" {...register('image', { required: 'Imagem é obrigatória' })} />
        {errors.image && <p className="input-error-message">{errors.image.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
      </button>
    </form>
  );
};

export default AddProductForm;