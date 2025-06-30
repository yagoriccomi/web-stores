// src/pages/ProductsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Importar axios para chamadas HTTP
import './ProductsPage.css';
import { useCart, type Product as CartProduct } from '../contexts/CartContext'; // Renomear Product para evitar conflito
import { useSearch } from '../contexts/SearchContext';
// Removido: import { allMockProducts } from '../contexts/fakebd';
import ProductBanner from '../components/ProductBanner';
import ProductFilters, { type ActiveFilters } from '../components/ProductFilters';

// Definir a interface do Produto como esperado da sua API
// Ajuste conforme a estrutura exata dos dados retornados por /api/products
export interface APIProduct {
  id: string; // ou number, dependendo do seu backend (_id do MongoDB é string)
  name: string;
  description: string;
  price: string; // Mantendo como string conforme seu backend formata
  iconPlaceholder: string; // Ou o nome do campo real, ex: imageUrl
  imageUrl?: string; // Adicionado como opcional
  category?: string;
  stock?: number;
  // Adicione outros campos que sua API retorna
}


// URLs do banner
const DESKTOP_BANNER_URL = "/public/Gemini_Generated_Image_xw25nixw25nixw25.png";
const MOBILE_BANNER_URL = "/public/Gemini_Generated_Image_xw25nixw25nixw25.png";

const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  return parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.').trim());
};

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange }) => {
  const buildPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    if (totalPages <= 1) return [];
    pageNumbers.push(1);
    const range = 1;
    let showLeftEllipsis = false;
    let showRightEllipsis = false;
    let startPageForLoop = Math.max(2, currentPage - range);
    let endPageForLoop = Math.min(totalPages - 1, currentPage + range);

    if (currentPage - range > 2) showLeftEllipsis = true;
    if (currentPage + range < totalPages - 1) showRightEllipsis = true;

    if (showLeftEllipsis) pageNumbers.push('...');
    for (let i = startPageForLoop; i <= endPageForLoop; i++) {
      if (!pageNumbers.includes(i)) pageNumbers.push(i);
    }
    if (showRightEllipsis && !pageNumbers.includes('...')) pageNumbers.push('...');
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    return [...new Set(pageNumbers)];
  };

  const pageNumbersToDisplay = buildPageNumbers();

  if (totalPages === 0) return null;
  // Ajustado para verificar se há produtos antes de mostrar "Página 1 de 1"
  if (totalPages === 1) {
     // A condição `allMockProducts.length > 0` será substituída pela verificação dos produtos carregados
     // Se não houver produtos carregados, não mostraremos a paginação.
     // O componente principal lidará com a mensagem de "nenhum produto".
    return null; // Ou mostrar "Página 1 de 1" apenas se houver produtos
  }


  return (
    <div className="pagination-controls">
      <span className="page-info">Página {currentPage} de {totalPages}</span>
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>Primeira</button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>Anterior</button>
      {pageNumbersToDisplay.map((page, index) =>
        typeof page === 'number' ? (
          <button key={page} onClick={() => onPageChange(page)} className={page === currentPage ? 'active' : ''}>{page}</button>
        ) : (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">{page}</span>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>Próxima</button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>Última</button>
    </div>
  );
};

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 20;

  // Estados para dados da API
  const [allProducts, setAllProducts] = useState<APIProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        // Seu backend está em '/api/products'
        // O frontend está em localhost:5173, backend em localhost:5001
        // Certifique-se que o CORS no backend permite requisições de localhost:5173
        const response = await axios.get<APIProduct[]>('http://localhost:5001/api/products');
        setAllProducts(response.data);
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError('Falha ao carregar produtos. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // Array de dependências vazio para rodar apenas uma vez ao montar

  const handleAddToCart = (product: APIProduct) => {
    // Adapte o produto da API para o formato esperado pelo CartContext, se necessário
    // No seu caso, a interface Product do CartContext é similar, mas vamos garantir
    const productForCart: CartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      iconPlaceholder: product.iconPlaceholder || product.imageUrl || '🛍️', // Fallback
      imageUrl: product.imageUrl || '🛍️',
    };
    addToCart(productForCart);
  };

  const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const processedProducts = useMemo(() => {
    let tempProducts = [...allProducts]; // AGORA USA OS PRODUTOS DA API

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
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

    switch (sortOrder) {
      case 'az':
        tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'priceLowHigh':
        tempProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'priceHighLow':
        tempProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      default:
        break;
    }
    return tempProducts;
  }, [searchTerm, activeFilters, sortOrder, allProducts]); // Adicionado allProducts às dependências

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(processedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  if (isLoading) {
    return <div className="products-page-container"><p className="loading-message" style={{textAlign: 'center', fontSize: '1.2rem', marginTop: '50px'}}>Carregando produtos...</p></div>;
  }

  if (error) {
    return <div className="products-page-container"><p className="error-message" style={{textAlign: 'center', color: 'red', fontSize: '1.2rem', marginTop: '50px'}}>{error}</p></div>;
  }

  const NoProductsMessage = () => {
    // Agora verificamos 'allProducts' para a mensagem inicial e 'processedProducts' para filtros/busca
    if (allProducts.length === 0 && !isLoading) { // Se a busca inicial da API não retornou nada
      return <p className="no-products-message">Nenhum produto disponível no momento.</p>;
    }
    if (processedProducts.length === 0 && !isLoading) { // Se filtros/busca não encontraram nada
      if (searchTerm) {
        return <p className="no-products-message">Nenhum produto encontrado para "{searchTerm}". Tente refinar seus filtros ou busca.</p>;
      }
      return <p className="no-products-message">Nenhum produto corresponde aos filtros selecionados no momento.</p>;
    }
    return null;
  };

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

      <NoProductsMessage />

      {currentProducts.length > 0 && (
        <div className="product-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-item">
              <Link to={`/products/${product.id}`} className="product-link">
                {/* Priorizar imageUrl se disponível, senão iconPlaceholder */}
                <div className="product-image-container" style={{backgroundColor: product.imageUrl ? 'transparent' : '#f0f0f0' }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                  ) : (
                    <span className="product-icon" role="img" aria-label={product.name}>
                      {product.iconPlaceholder || '🛍️'}
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

      {/* Mostrar paginação apenas se houver mais de uma página de resultados */}
      {totalPages > 1 && (
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