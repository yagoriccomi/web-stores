// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, type  ReactNode, useEffect } from 'react';

// Definindo uma interface para o produto (pode ser mais detalhada)
export interface Product {
  id: string;
  name: string;
  price: string; // Manter como string por enquanto, mas considere number para cálculos
  iconPlaceholder: string;
  description: string;
  // Adicione outras propriedades do produto conforme necessário (ex: image, stock)
}

// Interface para o item do carrinho, que inclui o produto e a quantidade
export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => string; // Retorna o total formatado como string
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Função para inicializar o carrinho a partir do localStorage
const getInitialCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem('shoppingCart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // Se o item já existe, incrementa a quantidade
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Se o item não existe, adiciona ao carrinho com quantidade 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      // Extrai o valor numérico do preço (ex: "R$ 99,90" -> 99.90)
      const priceNumber = parseFloat(item.price.replace('R$', '').replace(',', '.').trim());
      return sum + priceNumber * item.quantity;
    }, 0);
    return `R$ ${total.toFixed(2).replace('.', ',')}`; // Formata de volta para o padrão brasileiro
  };


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartItemCount, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};