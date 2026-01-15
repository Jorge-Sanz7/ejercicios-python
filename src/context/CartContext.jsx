import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantData, setRestaurantData] = useState({ restaurantId: 1, tableId: null });
  const [activeOrder, setActiveOrder] = useState(null); // simulacion

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const clearCart = () => setCartItems([]);
  
  const total = cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, clearCart, total, totalItems, 
      restaurantData, setRestaurantData, activeOrder, setActiveOrder 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);