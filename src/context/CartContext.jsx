import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from "../api/endpoints";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (e) {
      /* login qilinmagan bo'lsa jim turamiz */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refreshCart();
    else setCart({ items: [], total: 0 });
  }, [user, refreshCart]);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await apiAddToCart(productId, quantity);
    setCart(data);
  };

  const changeQuantity = async (itemId, quantity) => {
    const { data } = await updateCartItem(itemId, quantity);
    setCart(data);
  };

  const removeItem = async (itemId) => {
    const { data } = await removeCartItem(itemId);
    setCart(data);
  };

  return (
    <CartContext.Provider value={{ cart, loading, refreshCart, addItem, changeQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
