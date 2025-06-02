// src/pages/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';
import { allMockProducts } from '../contexts/fakebd';

// Importar os novos componentes
import ProductBanner from '../components/ProductBanner';
import ProductFilters from '../components/ProductFilters';
import type { ActiveFilters } from '../components/ProductFilters';
// Removed duplicate import of ActiveFilters

// URLs para o banner (substitua por suas imagens reais ou de um serviço de placeholder)
const DESKTOP_BANNER_URL = "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";
const MOBILE_BANNER_URL = "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg";


// Helper para converter string de preço para número
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
    // const maxButtonsVisibleAroundCurrent = 1; 

    if (totalPages <= 1) return [];

    if (totalPages > 1) pageNumbers.push(1);

    const range = 1; 
    let showLeftEllipsis = false;
    let showRightEllipsis = false;

    let startPageForLoop = currentPage - range;
    let endPageForLoop = currentPage + range;

    if (currentPage <= range + 2) { 
        startPageForLoop = 2;
        endPageForLoop = Math.min(totalPages -1 , (range * 2) + 2); 
    } else {
        showLeftEllipsis = true;
    }

    if (currentPage >= totalPages - (range + 1) ) { 
        startPageForLoop = Math.max(2, totalPages - (range * 2) - 1);
        endPageForLoop = totalPages - 1;
        // Se está perto do fim, não mostre a elipse da direita, a menos que haja muitas páginas
        if (currentPage + range < totalPages -1 && endPageForLoop < totalPages - 1) {
             showRightEllipsis = true;
        } else {
            showRightEllipsis = false;
        }

    } else if (currentPage > range + 2 && currentPage < totalPages - (range + 1)) { 
        showRightEllipsis = true;
    }


    if (showLeftEllipsis && startPageForLoop > 2) { // Adiciona elipse apenas se houver espaço
        pageNumbers.push('...');
    }

    for (let i = startPageForLoop; i <= endPageForLoop; i++) {
        if (i > 1 && i < totalPages) {
            pageNumbers.push(i);
        }
    }

    if (showRightEllipsis && endPageForLoop < totalPages -1) { // Adiciona elipse apenas se houver espaço
        pageNumbers.push('...');
    }
    
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
         pageNumbers.push(totalPages);
    }
    return [...new Set(pageNumbers)];
  };

  const pageNumbersToDisplay = buildPageNumbers();

  if (totalPages <= 1) { 
    if (totalPages === 1 && allMockProducts.length > 0){ 
         return <div className="pagination-controls"><span className="page-info">Página 1 de 1</span></div>;
    }
    return null;
  }

  return (
    <div className="pagination-controls">
      <span className="page-info">Página {currentPage} de {totalPages}</span>
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        Primeira
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </button>
      {pageNumbersToDisplay.map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={page} 
            onClick={() => onPageChange(page)}
            className={page === currentPage ? 'active' : ''}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className="pagination-ellipsis">{page}</span> 
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Próxima
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        Última
      </button>
    </div>
  );
};


const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 20;

  // Estados para filtros e ordenação
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    price: 'all',
    size: 'all', // Lembre-se: size e color são visuais por enquanto
    color: 'all',
  });
  const [sortOrder, setSortOrder] = useState<string>('relevance');

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    console.log(`${product.name} adicionado ao carrinho.`);
  };

  // Funções para atualizar filtros e ordenação
  const handleFilterChange = (filterType: keyof ActiveFilters, value: string) => {
    setActiveFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1); // Resetar paginação ao mudar filtro
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setCurrentPage(1); // Resetar paginação ao mudar ordenação
  };

  // Resetar para a primeira página quando o termo de pesquisa mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Lógica de filtragem e ordenação
  const processedProducts = React.useMemo(() => {
    let tempProducts = [...allMockProducts];

    // 1. Filtrar por searchTerm
    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 2. Aplicar filtros de preço
    if (activeFilters.price !== 'all') {
      tempProducts = tempProducts.filter(product => {
        const price = parsePrice(product.price);
        if (activeFilters.price === 'upto50') return price <= 50;
        if (activeFilters.price === '50to100') return price > 50 && price <= 100;
        if (activeFilters.price === '100to200') return price > 100 && price <= 200;
        if (activeFilters.price === 'over200') return price > 200;
        return true; // Should not happen if price filter is set
      });
    }
    
    // ATENÇÃO: Filtros de 'size' e 'color' não são aplicados funcionalmente
    // pois os dados dos produtos em `allMockProducts` não contêm essas propriedades.
    // Se você adicionar 'size' e 'color' aos seus produtos, implemente a lógica aqui.
    // Exemplo para 'color' (se 'product.color' existisse):
    // if (activeFilters.color !== 'all') {
    //   tempProducts = tempProducts.filter(product => product.color === activeFilters.color);
    // }

    // 3. Aplicar ordenação
    if (sortOrder === 'az') {
      tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'za') {
      tempProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === 'priceLowHigh') {
      tempProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOrder === 'priceHighLow') {
      tempProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    // 'relevance' (padrão) não necessita de ordenação específica aqui, 
    // a ordem é a da busca/filtros anteriores.

    return tempProducts;
  }, [searchTerm, activeFilters, sortOrder]);


  // Calcular produtos para a página atual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = processedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(processedProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); 
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
      
      {processedProducts.length === 0 && searchTerm && (
        <p className="no-products-message">Nenhum produto encontrado para "{searchTerm}". Tente refinar seus filtros ou busca.</p>
      )}
      
      {processedProducts.length === 0 && !searchTerm && (
         <p className="no-products-message">Nenhum produto corresponde aos filtros selecionados no momento.</p>
      )}
      
      {/* Condição para quando não há produtos mockados, caso allMockProducts esteja vazio */}
      {allMockProducts.length === 0 && (
         <p className="no-products-message">Nenhum produto disponível no momento.</p>
      )}


      {currentProducts.length > 0 && (
        <div className="product-grid">
          {currentProducts.map((product) => (
            <div key={product.id} className="product-item">
              <Link to={`/products/${product.id}`} className="product-link">
                <div className="product-icon-container">
                  <span className="product-icon" role="img" aria-label={product.name}>
                    {product.iconPlaceholder}
                  </span>
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
      
      {totalPages > 0 && ( // Mostrar paginação apenas se houver páginas
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