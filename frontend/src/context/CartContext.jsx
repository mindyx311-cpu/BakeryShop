// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [savedForLater, setSavedForLater] = useState([]);

  const getItemId = (item) =>
    item.productId !== undefined && item.productId !== null
      ? item.productId
      : item.id;

  //  add to the cart
  const addToCart = (product) => {
    const priceCents =
      product.priceCents ??
      product.price_cents ??
      (typeof product.price === 'number'
        ? Math.round(product.price * 100)
        : 0);

    setItems((prev) => {
      const id = product.id;
      const idx = prev.findIndex((it) => getItemId(it) === id);

      if (idx === -1) {
        return [
          ...prev,
          {
            productId: id,
            id,
            name: product.name,
            priceCents,
            quantity: 1,
          },
        ];
      } else {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + 1,
        };
        return copy;
      }
    });
  };

  // Quantity +
  const increaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        getItemId(item) === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setItems((prev) =>
      prev
        .map((item) =>
          getItemId(item) === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // delete
  const removeItem = (id, options = {}) => {
    const { fromSaved = false } = options;

    if (fromSaved) {
      setSavedForLater((prev) =>
        prev.filter((item) => getItemId(item) !== id)
      );
    } else {
      setItems((prev) =>
        prev.filter((item) => getItemId(item) !== id)
      );
    }
  };

  // Save for later
  const moveToSaved = (id) => {
    setItems((prevItems) => {
      const idx = prevItems.findIndex(
        (item) => getItemId(item) === id
      );
      if (idx === -1) return prevItems;

      const srcItem = prevItems[idx];

      setSavedForLater((prevSaved) => {
        const existIdx = prevSaved.findIndex(
          (it) => getItemId(it) === id
        );
        if (existIdx !== -1) {
          return prevSaved;
        }

        const saved = {
          ...srcItem,
          quantity: 1,
        };

        return [...prevSaved, saved];
      });

      return prevItems.filter((it) => getItemId(it) !== id);
    });
  };

  // Saved -> Cart
  const moveToCart = (id) => {
    setSavedForLater((prevSaved) => {
      const idx = prevSaved.findIndex(
        (item) => getItemId(item) === id
      );
      if (idx === -1) return prevSaved;

      const srcItem = prevSaved[idx];

      setItems((prevItems) => {
        const existIdx = prevItems.findIndex(
          (it) => getItemId(it) === id
        );

        if (existIdx === -1) {
          return [
            ...prevItems,
            {
              ...srcItem,
              quantity: 1,
            },
          ];
        } else {
          const copy = [...prevItems];
          copy[existIdx] = {
            ...copy[existIdx],
            quantity: copy[existIdx].quantity + 1,
          };
          return copy;
        }
      });

      return prevSaved.filter((it) => getItemId(it) !== id);
    });
  };

  // Empty shopping cart
  const clearCart = () => {
    setItems([]);
  };

  //  Checkout
  const checkout = async () => {
    if (items.length === 0) {
      return false;
    }
    return true;
  };

  const value = {
    items,
    savedForLater,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    moveToSaved,
    moveToCart,
    clearCart,
    checkout,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
}
