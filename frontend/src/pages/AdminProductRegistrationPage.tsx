// src/pages/AdminProductRegistrationPage.tsx
import React, { useState } from 'react';
import axios from 'axios'; // Para fazer a requisição HTTP
// import { useAuth } from '../contexts/AuthContext'; // Para proteger a rota no futuro

const AdminProductRegistrationPage: React.FC = () => {
  // const { userToken } = useAuth(); // Descomente para usar autenticação
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Geral');
  const [stock, setStock] = useState('0');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsLoading(true);

    if (!imageFile) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem para o produto.' });
      setIsLoading(false);
      return;
    }
    if (!productName || !description || !price) {
        setMessage({ type: 'error', text: 'Nome, descrição e preço são obrigatórios.' });
        setIsLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', description);
    formData.append('price', price.replace(',', '.')); // Enviar como número ou string que o backend parseará
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('image', imageFile);
    // formData.append('iconPlaceholder', '✨'); // Opcional, se quiser enviar um

    try {
      // Adicionar token de autenticação se necessário
      // const config = {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     // Authorization: `Bearer ${userToken}`,
      //   },
      // };
      // Ajuste a URL da API conforme necessário (ex: http://localhost:5001/api/products)
      const response = await axios.post('http://localhost:5001/api/products', formData, {
         headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage({ type: 'success', text: `Produto "${response.data.name}" cadastrado com sucesso!` });
      // Limpar formulário
      setProductName('');
      setDescription('');
      setPrice('');
      setCategory('Geral');
      setStock('0');
      setImageFile(null);
      setImagePreview(null);
      event.currentTarget.reset(); // Reseta o input file

    } catch (err: any) {
      console.error("Erro ao cadastrar produto:", err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao cadastrar produto. Verifique os dados e tente novamente.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container"> {/* Reutilizando classes de SignUpPage/ProfilePage para consistência */}
      <div className="login-box" style={{ maxWidth: '700px' }}>
        <h2>Cadastrar Novo Produto</h2>
        {message && (
          <p className={message.type === 'error' ? 'error-message' : 'success-message'} style={{textAlign: 'left', marginBottom: '15px', padding: '10px', border: `1px solid ${message.type === 'error' ? '#f5c6cb' : '#c3e6cb'}`, borderRadius: '4px', backgroundColor: message.type === 'error' ? '#f8d7da' : '#d4edda', color: message.type === 'error' ? '#721c24' : '#155724' }}>
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit} className="login-form section-form"> {/* Reutilizando classes */}
          <div className="form-group">
            <label htmlFor="productName">Nome do Produto:</label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '16px' }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Preço (ex: 199,90):</label>
              <input
                id="price"
                type="text" // Ou "number" com step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                pattern="^\d+([,.]\d{1,2})?$" // Simples validação de formato
                title="Use vírgula ou ponto como separador decimal. Ex: 29,90 ou 29.90"
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Categoria:</label>
              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
           <div className="form-group">
              <label htmlFor="stock">Estoque:</label>
              <input
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
              />
            </div>

          <div className="form-group">
            <label htmlFor="imageFile">Imagem do Produto:</label>
            <input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{border: '1px solid #ced4da', padding: '10px', borderRadius: '5px'}}
            />
            {imagePreview && (
              <div style={{ marginTop: '15px', textAlign: 'center' }}>
                <img src={imagePreview} alt="Pré-visualização" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px', border: '1px solid #ddd' }} />
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading} style={{marginTop: '20px'}}>
            {isLoading ? 'Cadastrando...' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProductRegistrationPage;