// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';

export default function Header() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '16px 40px',
      }}
    >
      <Link to="/products">
        <h1>Bakery Shop 🥖</h1>
      </Link>

      <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/products">Products</Link>
        <Link to="/cart">
          Cart{totalCount > 0 ? ` (${totalCount})` : ''}
        </Link>
        <Link to="/orders">Orders</Link>

        {user ? (
          <>
            <span>Hi, {user.username}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
