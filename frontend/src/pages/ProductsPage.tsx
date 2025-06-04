// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useMemo } from 'react'; // << MODIFICADO (useMemo)
import { Link } from 'react-router-dom';
import axios from 'axios'; // <<<--- ADICIONE ESTA LINHA
import './ProductsPage.css';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../contexts/CartContext'; // A interface Product foi atualizada
import { useSearch } from '../contexts/SearchContext';
// import { allMockProducts } from '../contexts/fakebd'; // <<<--- REMOVA OU COMENTE ESTA LINHA

import ProductBanner from '../components/ProductBanner';
import ProductFilters from '../components/ProductFilters';
import type { ActiveFilters } from '../components/ProductFilters'; // Correct import


const DESKTOP_BANNER_URL = "/public/Gemini_Generated_Image_xw25nixw25nixw25.png";
const MOBILE_BANNER_URL = "/public/Gemini_Generated_Image_xw25nixw25nixw25.png";

const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  return parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.').trim());
};

interface PaginationControlsProps { /* ... (sem alterações) ... */ }
const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => { /* ... (sem alterações) ... */ };


const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();
  const [allProducts, setAllProducts] = useState<Product[]>([]); // <<<--- NOVO ESTADO PARA PRODUTOS DA API
  const [isLoading, setIsLoading] = useState<boolean>(true); // <<<--- NOVO ESTADO PARA LOADING
  const [error, setError] = useState<string | null>(null); // <<<--- NOVO ESTADO PARA ERRO

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 20;

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    price: 'all',
    size: 'all',
    color: 'all',
  });
  const [sortOrder, setSortOrder] = useState<string>('relevance');

  // Buscar produtos da API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ajuste a URL da API conforme necessário
        const response = await axios.get('http://localhost:5001/api/products');
        setAllProducts(response.data);
      } catch (err: any) {
        console.error("Erro ao buscar produtos:", err);
        setError(err.message || 'Falha ao carregar produtos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []); // Executa uma vez ao montar o componente

  const handleAddToCart = (product: Product) => { /* ... (sem alterações) ... */ };
  const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => { /* ... (sem alterações) ... */ };
  const handleSortChange = (value: string) => { /* ... (sem alterações) ... */ };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilters, sortOrder]); // <<<--- activeFilters e sortOrder adicionados como dependência

  // Lógica de filtragem e ordenação AGORA USA `allProducts`
  const processedProducts = useMemo(() => { // <<<--- useMemo para otimizar
    let tempProducts = [...allProducts];

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (activeFilters.price !== 'all') {
      tempProducts = tempProducts.filter(product => {
        const price = parsePrice(product.price);
        if (activeFilters.price === 'upto50') return price <= 50;
        if (activeFilters.price === '50to100') return price > 50 && price <= 100;
        if (activeFilters.price === '100to200') return price > 100 && price <= 200;
        if (activeFilters.price === 'over200') return price > 200;
        return true;
      });
    }
    // Filtros de size e color (se implementados nos dados do produto)
    // ...

    if (sortOrder === 'az') {
      tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'za') {
      tempProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'priceLowHigh') {
      tempProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === 'priceHighLow') {
      tempProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return tempProducts;
  }, [allProducts, searchTerm, activeFilters, sortOrder]); // <<<--- Dependências do useMemo

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => { /* ... (sem alterações) ... */ };

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Carregando produtos...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: 'red' }}>Erro ao carregar produtos: {error}</div>;
  }

  console.log('ProductsPage - Passing activeFilters:', activeFilters); // <-- ADD THIS LOG

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
      {processedProducts.length === 0 && searchTerm && (
        <p className="no-products-message">Nenhum produto encontrado para "{searchTerm}". Tente refinar seus filtros ou busca.</p>
      )}
      {processedProducts.length === 0 && !searchTerm && allProducts.length > 0 && (
        <p className="no-products-message">Nenhum produto corresponde aos filtros selecionados no momento.</p>
      )}
      {allProducts.length === 0 && !isLoading && ( // <<<--- Mensagem se a API não retornar produtos
        <p className="no-products-message">Nenhum produto disponível no momento.</p>
      )}

      {currentProducts.length > 0 && (
        <div className="product-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-item">
              <Link to={`/products/${product.id}`} className="product-link"> {/* Rota de detalhe não implementada */}
                <div className="product-icon-container" style={{ backgroundColor: 'transparent' }}> {/* Alterado para imagem */}
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
                  ) : (
                    <span className="product-icon" role="img" aria-label={product.name}>
                      {product.iconPlaceholder}
                    </span>
                  )}
                </div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">{product.price}</p>
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
      )}

      {totalPages > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductsPage;