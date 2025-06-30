// src/components/ProductFilters.tsx
import React from 'react';
import './ProductFilters.css';

// Exporta a interface para que possa ser usada em outros arquivos, como na página que gerencia o estado dos filtros.
export interface ActiveFilters {
  price: string;
  size: string;
  color: string;
}

// Define as propriedades que o componente espera receber.
interface ProductFiltersProps {
  onFilterChange: (filterType: keyof ActiveFilters, value: string) => void;
  onSortChange: (sortValue: string) => void;
  activeFilters: ActiveFilters;
  currentSort: string;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  onSortChange,
  activeFilters,
  currentSort,
}) => {
  // Log para depuração: ajuda a verificar se os filtros corretos estão sendo recebidos pelo componente.
  console.log('ProductFilters - Received activeFilters:', activeFilters);

  // Verificação de segurança: se activeFilters for nulo ou indefinido, exibe uma mensagem de erro em vez de quebrar a aplicação.
  if (!activeFilters) {
    console.error('CRÍTICO: activeFilters está indefinido no componente ProductFilters!');
    return <div>Erro ao carregar filtros...</div>;
  }

  return (
    <div className="product-filters-bar">
      {/* Seção de Filtros */}
      <div className="filters-section">
        <label htmlFor="filter-price">Preço:</label>
        <select
          id="filter-price"
          value={activeFilters.price} // O valor é controlado pelo estado do componente pai
          onChange={(e) => onFilterChange('price', e.target.value)}
        >
          <option value="all">Todos os Preços</option>
          <option value="upto50">Até R$ 50,00</option>
          <option value="50to100">R$ 50,01 - R$ 100,00</option>
          <option value="100to200">R$ 100,01 - R$ 200,00</option>
          <option value="over200">Acima de R$ 200,00</option>
        </select>

        <label htmlFor="filter-size">Tamanho:</label>
        <select
          id="filter-size"
          value={activeFilters.size}
          onChange={(e) => onFilterChange('size', e.target.value)}
        >
          <option value="all">Todos os Tamanhos</option>
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>

        <label htmlFor="filter-color">Cor:</label>
        <select
          id="filter-color"
          value={activeFilters.color}
          onChange={(e) => onFilterChange('color', e.target.value)}
        >
          <option value="all">Todas as Cores</option>
          <option value="white">Branco</option>
          <option value="black">Preto</option>
          <option value="red">Vermelho</option>
          <option value="blue">Azul</option>
          <option value="green">Verde</option>
        </select>
      </div>

      {/* Seção de Ordenação */}
      <div className="sort-section">
        <label htmlFor="sort-order">Ordenar por:</label>
        <select
          id="sort-order"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="relevance">Relevância</option>
          <option value="az">Nome (A-Z)</option>
          <option value="za">Nome (Z-A)</option>
          <option value="priceLowHigh">Menor Preço</option>
          <option value="priceHighLow">Maior Preço</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;