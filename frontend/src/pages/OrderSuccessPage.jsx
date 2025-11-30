// src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import './OrderSuccessPage.css';

function OrderSuccessPage() {
  const { clearCart } = useCart() || {};
  const [cleared, setCleared] = useState(false);

  
  useEffect(() => {
    if (!cleared && typeof clearCart === "function") {
      clearCart();
      setCleared(true); 
    }
  }, [cleared, clearCart]);

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon">✓</div>

        <h2>Thank you!</h2>

        <p className="success-main-text">
          Your order has been placed successfully.
        </p>

        <p className="success-sub-text">
          We’ve sent you a confirmation email and will let you know
          when your items are on the way.
        </p>

        <div className="success-actions">
          <Link to="/orders" className="btn primary">
            View your orders
          </Link>

          <Link to="/products" className="btn">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;
