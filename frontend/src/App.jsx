// src/App.jsx
import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';

import ProductsPage from './pages/ProductsPage.jsx';
import CartPage from './pages/CartPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';

import useCart from './hooks/useCart.js';
import useAuth from './hooks/useAuth.js';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import './App.css';

function App() {
  const { items } = useCart();
  const { user, logout } = useAuth();

  const totalQty = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <>
     
      <header className="app-header">
        <div className="header-inner">
          <Link to="/products" className="logo">
            Bakery Shop <span className="logo-emoji">🥖</span>
          </Link>

          <nav className="nav">
            <Link to="/products" className="nav-link">
              Products
            </Link>

            <Link to="/cart" className="nav-link">
              {totalQty > 0 ? `Cart (${totalQty})` : 'Cart'}
            </Link>

            <Link to="/orders" className="nav-link">
              Orders
            </Link>

            {user ? (
              <div className="user-area">
                <span className="user-name">
                  Hi, {user.username || 'mindy'}
                </span>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <div className="user-area">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          
          <Route element={<ProtectedRoute />}>
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
