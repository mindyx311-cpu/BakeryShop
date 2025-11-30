// src/components/ProductCard.jsx
import React from 'react';
import useCart from '../hooks/useCart.js';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

 
  const priceCents =
    product.priceCents ??
    product.price_cents ?? 
    0;

  const price = (priceCents / 100).toFixed(2);

  const stock =
    product.stock ??
    product.stockQuantity ??
    product.stock_count ??
    product.stockCount ??
    0;

  return (
    <div
      style={{
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 16,
        width: 260,
      }}
    >
      <h3 style={{ marginBottom: 8 }}>{product.name}</h3>
      <p style={{ minHeight: 60 }}>{product.description}</p>

      <p style={{ fontWeight: 'bold', marginTop: 8 }}>${price}</p>
      <p>Stock: {stock}</p>

      <button
        style={{
          marginTop: 12,
          padding: '6px 12px',
          borderRadius: 4,
          border: 'none',
          background: '#6a5af9',
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => addToCart(product)}
      >
        Add to cart
      </button>
    </div>
  );
}
