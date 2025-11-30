// src/pages/CartPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import './CartPage.css';

function CartPage() {
  const {
    items = [],
    savedForLater = [],
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    moveToSaved,
    moveToCart,
    clearCart,
  } = useCart() || {};

  const cartItems = items || [];
  const savedItems = savedForLater || [];

  const cartIsEmpty = cartItems.length === 0;
  const savedIsEmpty = savedItems.length === 0;

  const navigate = useNavigate();

  const getItemId = (item) =>
    item.productId !== undefined && item.productId !== null
      ? item.productId
      : item.id;

  const getPriceCents = (item) => {
    if (typeof item.priceCents === 'number') return item.priceCents;
    if (typeof item.price_cents === 'number') return item.price_cents;
    return 0;
  };

  const formatPrice = (cents) => {
    const value =
      typeof cents === 'number' && Number.isFinite(cents)
        ? cents
        : Number(cents) || 0;

    return `$${(value / 100).toFixed(2)}`;
  };

  const [selectedIds, setSelectedIds] = useState(
    cartItems.map((item) => getItemId(item))
  );

  const prevIdsRef = useRef(cartItems.map((item) => getItemId(item)));

  useEffect(() => {
    const newIds = cartItems.map((item) => getItemId(item));
    const prevIds = prevIdsRef.current;

    const addedIds = newIds.filter((id) => !prevIds.includes(id));
    const removedIds = prevIds.filter((id) => !newIds.includes(id));

    setSelectedIds((prevSelected) => {
      let next = prevSelected.filter((id) => !removedIds.includes(id));
      addedIds.forEach((id) => {
        if (!next.includes(id)) next.push(id);
      });
      return next;
    });

    prevIdsRef.current = newIds;
  }, [cartItems]);

  const toggleItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(cartItems.map((item) => getItemId(item)));
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) => selectedIds.includes(getItemId(item)));

  const cartSubtotalCents = cartItems.reduce((sum, item) => {
    const id = getItemId(item);
    if (!selectedIds.includes(id)) return sum;
    return sum + getPriceCents(item) * item.quantity;
  }, 0);

  const selectedCount = cartItems.reduce((count, item) => {
    const id = getItemId(item);
    return selectedIds.includes(id) ? count + 1 : count;
  }, 0);

  const handleIncrease = (id) => {
    if (typeof increaseQuantity === 'function') increaseQuantity(id);
  };

  const handleDecrease = (id) => {
    if (typeof decreaseQuantity === 'function') decreaseQuantity(id);
  };

  const handleRemove = (id, options) => {
    if (typeof removeItem === 'function') removeItem(id, options);
  };

  const handleMoveToSaved = (id) => {
    if (typeof moveToSaved === 'function') moveToSaved(id);
  };

  const handleMoveToCart = (id) => {
    if (typeof moveToCart === 'function') moveToCart(id);
  };

  const handleClearCart = () => {
    if (typeof clearCart === 'function') clearCart();
  };

  
  const handleCheckout = () => {
    if (cartIsEmpty) return;

    const selectedItems = cartItems.filter((item) =>
      selectedIds.includes(getItemId(item))
    );

    if (selectedItems.length === 0) {
      alert('Please select at least one item to check out.');
      return;
    }

    navigate('/checkout', { state: { items: selectedItems } });
  };

  if (cartIsEmpty && savedIsEmpty) {
    return (
      <div className="cart-page">
        <h2>Your Cart</h2>
        <p className="empty-cart">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      {!cartIsEmpty && (
        <>
          <div className="select-toggle">
            {allSelected ? (
              <button type="button" className="link-like" onClick={deselectAll}>
                Deselect all items
              </button>
            ) : (
              <button type="button" className="link-like" onClick={selectAll}>
                Select all items
              </button>
            )}
          </div>

          <table className="cart-table">
            <thead>
              <tr>
                <th></th>
                <th>Item</th>
                <th style={{ width: '160px' }}>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
                <th style={{ width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => {
                const id = getItemId(item);
                const priceCents = getPriceCents(item);
                const rowSubtotalCents = priceCents * item.quantity;
                const checked = selectedIds.includes(id);

                return (
                  <tr key={id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItem(id)}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <div className="qty-controls">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleDecrease(id)}
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleIncrease(id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatPrice(priceCents)}</td>
                    <td>{formatPrice(rowSubtotalCents)}</td>
                    <td>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => handleMoveToSaved(id)}
                      >
                        Save for later
                      </button>
                      <button
                        type="button"
                        className="link-btn danger"
                        onClick={() => handleRemove(id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="cart-footer">
            <div className="cart-total">
              Subtotal ({selectedCount} item
              {selectedCount === 1 ? '' : 's'}):{' '}
              <strong>{formatPrice(cartSubtotalCents)}</strong>
            </div>
            <div className="cart-footer-buttons">
              <button type="button" onClick={handleClearCart}>
                Clear Cart
              </button>
              <button type="button" className="primary" onClick={handleCheckout}>
                Check Out
              </button>
            </div>
          </div>
        </>
      )}

      {!savedIsEmpty && (
        <section className="saved-section">
          <h3>Saved for later</h3>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th style={{ width: '220px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedItems.map((item) => {
                const id = getItemId(item);
                const priceCents = getPriceCents(item);

                return (
                  <tr key={id}>
                    <td>{item.name}</td>
                    <td>{formatPrice(priceCents)}</td>
                    <td>
                      <button
                        type="button"
                        className="link-btn"
                        onClick={() => handleMoveToCart(id)}
                      >
                        Move to cart
                      </button>
                      <button
                        type="button"
                        className="link-btn danger"
                        onClick={() => handleRemove(id, { fromSaved: true })}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default CartPage;
