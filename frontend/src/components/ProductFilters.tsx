// src/components/ProductFilters.tsx
import React from 'react';
import './ProductFilters.css';

export interface ActiveFilters { // <--- MAKE SURE 'export' IS HERE
  price: string;
  size: string;
  color: string;
}

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
  // ... rest of the component code
  return (
    <div className="product-filters-bar">
      {/* Filters */}
      <div className="filters-section">
        <label htmlFor="filter-price">Preço:</label>
        <select
          id="filter-price"
          value={activeFilters.price}
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

      {/* Sort */}
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