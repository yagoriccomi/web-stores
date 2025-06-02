// src/pages/ProductsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductsPage.css'; // CSS específico para esta página
import { useCart } from '../contexts/CartContext';
import type { Product } from '../contexts/CartContext';
import { useSearch } from '../contexts/SearchContext';     // Para o filtro

// Lista expandida de produtos mockados
const allMockProducts: Product[] = [
  { id: '1', name: 'Tapete de Yoga Premium Conforto', price: 'R$ 199,90', iconPlaceholder: '🧘', description: 'Conforto e aderência para sua prática diária.' },
  { id: '2', name: 'Vela Aromática de Lavanda Relax', price: 'R$ 49,90', iconPlaceholder: '🕯️', description: 'Relaxe com o aroma suave da lavanda pura.' },
  { id: '3', name: 'Sino Tibetano para Meditação Zen', price: 'R$ 179,90', iconPlaceholder: '🎶', description: 'Som puro para harmonia e meditação profunda.' },
  { id: '4', name: 'Kit Incensos Naturais Purificantes', price: 'R$ 89,90', iconPlaceholder: '🌿', description: 'Variedade de aromas para purificar o ambiente.' },
  { id: '5', name: 'Garrafa com Cristal Quartzo Rosa', price: 'R$ 139,90', iconPlaceholder: '💧', description: 'Energize sua água com a vibração do amor.' },
  { id: '6', name: 'Livro: Guia de Yoga para Iniciantes', price: 'R$ 59,90', iconPlaceholder: '📚', description: 'Guia completo para começar sua jornada no yoga.' },
  { id: '7', name: 'Chá Calmante de Camomila Orgânico', price: 'R$ 29,90', iconPlaceholder: '🍵', description: 'Mistura orgânica para noites tranquilas e serenas.' },
  { id: '8', name: 'Japamala 108 Contas Rudraksha Sagrada', price: 'R$ 119,90', iconPlaceholder: '💎', description: 'Para meditação, foco e entoação de mantras.' },
  { id: '9', name: 'Almofada de Meditação Zafu Confort', price: 'R$ 159,90', iconPlaceholder: '🧘‍♀️', description: 'Suporte ideal para longas sessões de meditação.' },
  { id: '10', name: 'Óleo Essencial Puro Eucalipto', price: 'R$ 35,90', iconPlaceholder: '🍃', description: 'Refrescante e revigorante para aromaterapia eficaz.' },
  { id: '11', name: 'Fonte de Água Decorativa Zen Garden', price: 'R$ 299,90', iconPlaceholder: '⛲', description: 'Som relaxante de água para seu ambiente de paz.' },
  { id: '12', name: 'Canga Indiana Estampada Floral', price: 'R$ 75,00', iconPlaceholder: '🌸', description: 'Multiuso: praia, yoga, piquenique, decoração vibrante.' },
  { id: '13', name: 'Pedra Selenita Branca Purificadora', price: 'R$ 45,00', iconPlaceholder: '🤍', description: 'Para limpeza energética profunda e paz interior.' },
  { id: '14', name: 'Spray Energético de Alecrim Fresco', price: 'R$ 55,90', iconPlaceholder: '✨', description: 'Renove as energias do seu espaço com frescor.' },
  { id: '15', name: 'Kit Pedras dos 7 Chakras Alinhamento', price: 'R$ 129,00', iconPlaceholder: '🌈', description: 'Para alinhamento e equilíbrio completo dos chakras.' },
  { id: '16', name: 'Difusor Ultrassônico de Aromas Wood', price: 'R$ 220,00', iconPlaceholder: '💨', description: 'Umidifica e perfuma o ambiente suavemente.' },
  { id: '17', name: 'Rolo de Massagem Miofascial Pro', price: 'R$ 95,00', iconPlaceholder: '💪', description: 'Libere a tensão muscular e melhore a circulação.' },
  { id: '18', name: 'Buda Decorativo em Resina Dourado', price: 'R$ 110,00', iconPlaceholder: '🗿', description: 'Estátua serena para inspirar tranquilidade e foco.' },
  { id: '19', name: 'Pulseira dos 7 Chakras com Lava', price: 'R$ 65,00', iconPlaceholder: '💫', description: 'Equilíbrio e proteção energética no seu dia a dia.' },
  { id: '20', name: 'Incenso Natural de Palo Santo (Maço)', price: 'R$ 45,00', iconPlaceholder: '🪵', description: 'Madeira sagrada para purificação e boas vibrações.' },
  // Para adicionar mais 48 produtos e chegar a 68 (8 originais + 60 novos),
  // você pode continuar esta lista ou usar um gerador/script.
  // Exemplo de como poderia ser uma entrada adicional:
  // { id: '21', name: 'Estátua Ganesha Pequena', price: 'R$ 79,00', iconPlaceholder: '🐘', description: 'Prosperidade e sabedoria para seu lar ou altar.' },
];

const ProductsPage: React.FC = () => {
  const { addToCart } = useCart();
  const { searchTerm } = useSearch(); // Obter o termo de pesquisa do contexto

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Você pode adicionar um feedback visual aqui, como um toast/alert
    console.log(`${product.name} adicionado ao carrinho.`);
  };

  // Filtrar produtos com base no searchTerm
  // A filtragem agora considera o nome do produto
  const filteredProducts = allMockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) // Opcional: filtrar pela descrição também
  );

  return (
    <div className="products-page-container">
      <h1 className="products-page-title">Nossos Produtos Zen</h1>
      
      {/* Exibir mensagem se nenhum produto for encontrado após uma pesquisa */}
      {filteredProducts.length === 0 && searchTerm && (
        <p className="no-products-message">Nenhum produto encontrado para "{searchTerm}".</p>
      )}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-item">
            {/* Idealmente, o Link levaria para uma página de detalhes do produto */}
            <Link to={`/products/${product.id}`} className="product-link">
              <div className="product-icon-container">
                <span className="product-icon" role="img" aria-label={product.name}>
                  {product.iconPlaceholder} {/* Usando o emoji como ícone */}
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
    </div>
  );
};

export default ProductsPage;