import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from local storage on startup
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      // Logic to check if item exists using _id (MongoDB) or id (Dummy)
      const existingItem = prevCart.find((item) => (item._id || item.id) === (product._id || product.id));

      if (existingItem) {
        // If item exists, increase quantity
        return prevCart.map((item) =>
          (item._id || item.id) === (product._id || product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If new, add it with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => 
      prevCart.filter((item) => (item._id || item.id) !== productId)
    );
  };

  // ✅ THIS IS THE FUNCTION YOU WERE MISSING
  const clearCart = () => {
    setCart([]); // Wipes the cart clean
    localStorage.removeItem('cart');
  };

  // Calculate Total Price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};