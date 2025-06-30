// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductsPage.css';
import { useCart, type Product } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import ProductBanner from '../components/ProductBanner';
import ProductFilters, { type ActiveFilters } from '../components/ProductFilters';

// --- CONFIGURAÇÕES E TIPAGEM ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const DESKTOP_BANNER_URL = "/Gemini_Generated_Image_xw25nixw25nixw25.png";
const MOBILE_BANNER_URL = "/Gemini_Generated_Image_xw25nixw25nixw25.png";

// Interface para o produto como vem da API (preço como número)
interface ApiProduct extends Omit<Product, 'price'> {
  price: number;
}

// --- COMPONENTE PRINCIPAL ---

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();

  // Estados para dados, carregamento e erros da API
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para filtros e ordenação (da Versão 1)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    price: 'all',
    size: 'all', // Estes filtros podem ser implementados se sua API os suportar
    color: 'all',
  });
  const [sortOrder, setSortOrder] = useState<string>('relevance');

  // Efeito para buscar os produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        setAllProducts(response.data);
      } catch (err) {
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        console.error('Erro ao buscar produtos:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lógica de processamento de produtos (Busca + Filtros + Ordenação)
  const processedProducts = useMemo(() => {
    let tempProducts = [...allProducts];

    // 1. Aplicar busca
    if (searchTerm) {
      tempProducts = tempProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Aplicar filtro de preço
    if (activeFilters.price !== 'all') {
      tempProducts = tempProducts.filter(product => {
        const price = product.price; // Preço já é número
        if (activeFilters.price === 'upto50') return price <= 50;
        if (activeFilters.price === '50to100') return price > 50 && price <= 100;
        if (activeFilters.price === '100to200') return price > 100 && price <= 200;
        if (activeFilters.price === 'over200') return price > 200;
        return true;
      });
    }
    
    // 3. Aplicar ordenação
    switch (sortOrder) {
      case 'az':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'priceLowHigh':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    return tempProducts;
  }, [searchTerm, activeFilters, sortOrder, allProducts]);

  // Agrupa os produtos já processados por categoria
  const groupedProducts = useMemo(() => {
    return processedProducts.reduce((acc, product) => {
      const category = product.category || 'Geral';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, ApiProduct[]>);
  }, [processedProducts]);


  // --- Handlers ---

  const handleAddToCart = (product: ApiProduct) => {
    const productForCart: Product = {
      ...product,
      price: `R$ ${product.price.toFixed(2).replace('.', ',')}`
    };
    addToCart(productForCart);
  };

  const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  // --- Renderização ---

  if (isLoading) {
    return <div className="products-page-container"><p className="loading-message">Carregando produtos...</p></div>;
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

      <ProductFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        activeFilters={activeFilters}
        currentSort={sortOrder}
      />

      {Object.keys(groupedProducts).length === 0 && !isLoading && (
        <p className="no-products-message">Nenhum produto encontrado com os critérios atuais.</p>
      )}

      {Object.keys(groupedProducts).map(category => (
        <section key={category} className="product-section">
          <h2 className="product-section-title">{category}</h2>
          <div className="product-grid">
            {groupedProducts[category].map((product) => (
              <div key={product.id} className="product-item">
                <Link to={`/products/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  </div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
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