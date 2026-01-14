import React, { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantData, setRestaurantData] = useState({ restaurantId: null, tableId: null });
  const [activeOrder, setActiveOrder] = useState(null);

  const setTableInfo = (resId, tableId) => {
    setRestaurantData({ restaurantId: resId, tableId: tableId });
  };

  const addToCart = (product, initialQuantity = 1, notes = '') => {
    setCartItems(currentItems => {
      const productId = product.id || product.id_producto;
      const existingItemIndex = currentItems.findIndex(item => item.productId === productId && item.notes === notes);
      if (existingItemIndex > -1) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += initialQuantity;
        return newItems;
      }
      return [...currentItems, {
        productId,
        name: product.name || product.nombre,
        price: product.price || product.precio,
        quantity: initialQuantity,
        notes,
        image: product.imagen
      }];
    });
  };

  const updateQuantity = (productId, change, notes = '') => {
    setCartItems(currentItems => {
      const index = currentItems.findIndex(item => item.productId === productId && item.notes === notes);
      if (index === -1) return currentItems;
      const newItems = [...currentItems];
      newItems[index].quantity += change;
      if (newItems[index].quantity <= 0) newItems.splice(index, 1);
      return newItems;
    });
  };

  const clearCart = () => { setCartItems([]); setActiveOrder(null); };

  const { total, totalItems } = useMemo(() => ({
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }), [cartItems]);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, clearCart, total, totalItems, 
      restaurantData, setTableInfo, activeOrder, setActiveOrder 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);