// web-stores/frontend/src/pages/ProductsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.css';
import { useCart, type Product } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import ProductBanner from '../components/ProductBanner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// O banner continua o mesmo
const DESKTOP_BANNER_URL = "/public/Gemini_Generated_Image_xw25nixw25nixw25.png";
const MOBILE_BANNER_URL = "/public/Gemini_Generated_Image_xw25nixw25nixw25.png";

// Interface para o produto como vem da API (antes da formatação de preço)

// A interface base `Product` já tem quase tudo que precisamos
// Apenas definimos aqui o que vem da API, que tem o preço como número
interface ApiProduct extends Omit<Product, 'price'> {
  price: number;
}

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();

  // Estados para controlar o carregamento, produtos e erros da API
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar os produtos da API quando a página carrega
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        // A API já retorna no formato que precisamos, incluindo a categoria
        setProducts(response.data);
      } catch (err) {
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Agrupa os produtos por categoria usando useMemo para otimização
  const groupedProducts = useMemo(() => {
    // Primeiro, filtra os produtos com base no termo de busca
    const filteredProducts = searchTerm
      ? products.filter(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products;

    // Depois, agrupa os produtos filtrados por categoria
    return filteredProducts.reduce((acc, product) => {
      const category = product.category || 'Geral';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, ApiProduct[]>);
  }, [products, searchTerm]);

  const handleAddToCart = (product: ApiProduct) => {
    // Converte o produto da API para o formato que o carrinho espera
    const productForCart: Product = {
        ...product,
        price: `R$ ${product.price.toFixed(2).replace('.', ',')}`
    };
    addToCart(productForCart);
    console.log(`${product.name} adicionado ao carrinho.`);
  };

  if (isLoading) {
    return <div className="products-page-container"><p>Carregando produtos...</p></div>;
  }

  if (error) {
    return <div className="products-page-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="products-page-container">
      <ProductBanner 
        desktopImage={DESKTOP_BANNER_URL} 
        mobileImage={MOBILE_BANNER_URL} 
        altText="Descubra Nossos Produtos Zen" 
      />
      
      {Object.keys(groupedProducts).length === 0 && (
         <p className="no-products-message">Nenhum produto encontrado.</p>
      )}

      {/* Mapeia cada categoria (cada chave do objeto groupedProducts) para uma seção */}
      {Object.keys(groupedProducts).map(category => (
        <section key={category} className="product-section">
          <h2 className="product-section-title">{category}</h2>
          <div className="product-grid">
            {groupedProducts[category].map((product) => (
              <div key={product.id} className="product-item">
                <Link to={`/products/${product.id}`} className="product-link">
                  <div className="product-icon-container">
                    {/* Agora usamos a imageUrl vinda do Cloudinary */}
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  {/* Formata o preço na exibição */}
                  <p className="product-price">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                </Link>
                <button 
                  className="add-to-cart-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductsPage;