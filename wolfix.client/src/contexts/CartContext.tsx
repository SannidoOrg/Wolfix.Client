import { createContext, useContext, useState, FC, ReactNode } from 'react';
import { ICartItem } from '../types';

interface ICartContext {
  cart: ICartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<ICartItem[]>([]);

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};