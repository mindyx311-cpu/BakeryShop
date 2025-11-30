// src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useCart from '../hooks/useCart.js';
import useAuth from '../hooks/useAuth.js';
import './CheckoutPage.css';

function CheckoutPage() {
  const cart = useCart() || {};
  const { items: cartItems = [], clearCart } = cart;

  const { user, token } = useAuth() || {};

  const location = useLocation();
  const itemsFromState = location.state?.items;

  const items =
    Array.isArray(itemsFromState) && itemsFromState.length > 0
      ? itemsFromState
      : cartItems;

  const navigate = useNavigate();

  useEffect(() => {
    
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (!items || items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [user, items, navigate]);

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

  const itemsSubtotalCents = items.reduce(
    (sum, item) => sum + getPriceCents(item) * item.quantity,
    0
  );

  const shippingCents = 0;
  const taxCents = 0;
  const orderTotalCents =
    itemsSubtotalCents + shippingCents + taxCents;

  const [deliveryDateText] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  });

  const [shipping, setShipping] = useState({
    fullName: '',
    addressLine1: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  const handleChangeShipping = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const [paymentMethod, setPaymentMethod] = useState('card');

  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
  });

  const handleChangeCard = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
  };

  const [errorMsg, setErrorMsg] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!items || items.length === 0) return;

    
    let username = user?.username || null;

    
    if (!username) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          username = parsed?.username || null;
        } catch (err) {
          console.error('Failed to parse user from localStorage', err);
        }
      }
    }

    if (!username) {
      setErrorMsg('No username found. Please login again.');
      navigate('/login', { replace: true });
      return;
    }

    const payload = {
      username, 
      items: items.map((item) => ({
        productId: getItemId(item),
        quantity: item.quantity,
      })),
    };

    try {
      const jwt =
        token || localStorage.getItem('token') || null;

      const res = await fetch(
        'http://localhost:8080/api/orders/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          msg = body?.error || body?.message || msg;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      
      clearCart?.();
      navigate('/order-success');
    } catch (err) {
      console.error('Checkout failed', err);
      setErrorMsg(err.message || 'Checkout failed');
    }
  };

  if (!user || !items || items.length === 0) {
    return null; 
  }

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Secure checkout</h2>

      {errorMsg && (
        <div className="checkout-error">❌ {errorMsg}</div>
      )}

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        {/* left */}
        <div className="checkout-left">
          <section className="checkout-section">
            <div className="section-header">
              <h3>Delivering to</h3>
            </div>
            <div className="section-body">
              <div className="field-row">
                <label>Full name</label>
                <input
                  type="text"
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleChangeShipping}
                  required
                />
              </div>
              <div className="field-row">
                <label>Address</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={shipping.addressLine1}
                  onChange={handleChangeShipping}
                  required
                />
              </div>
              <div className="field-row field-row-inline">
                <div>
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={shipping.city}
                    onChange={handleChangeShipping}
                    required
                  />
                </div>
                <div>
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={shipping.state}
                    onChange={handleChangeShipping}
                    required
                  />
                </div>
                <div>
                  <label>ZIP</label>
                  <input
                    type="text"
                    name="zip"
                    value={shipping.zip}
                    onChange={handleChangeShipping}
                    required
                  />
                </div>
              </div>
              <div className="field-row">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={shipping.phone}
                  onChange={handleChangeShipping}
                />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <div className="section-header">
              <h3>Paying with</h3>
            </div>
            <div className="section-body">
              <div className="radio-row">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit / Debit Card
                </label>
              </div>
              <div className="radio-row">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on delivery
                </label>
              </div>

              {paymentMethod === 'card' && (
                <div className="card-fields">
                  <div className="field-row">
                    <label>Card number</label>
                    <input
                      type="text"
                      name="number"
                      value={card.number}
                      onChange={handleChangeCard}
                    />
                  </div>
                  <div className="field-row field-row-inline">
                    <div>
                      <label>Expiry</label>
                      <input
                        type="text"
                        name="expiry"
                        value={card.expiry}
                        onChange={handleChangeCard}
                      />
                    </div>
                    <div>
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={card.cvv}
                        onChange={handleChangeCard}
                      />
                    </div>
                  </div>
                  <div className="field-row">
                    <label>Name on card</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={card.nameOnCard}
                      onChange={handleChangeCard}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="checkout-section">
            <div className="section-header">
              <h3>Delivery</h3>
            </div>
            <div className="section-body">
              <p className="delivery-text">
                Estimated delivery: <strong>{deliveryDateText}</strong>
              </p>
            </div>
          </section>
        </div>

        {/* right */}
        <aside className="checkout-right">
          <section className="summary-card">
            <h3>Order summary</h3>

            <div className="summary-row">
              <span>Items ({items.length})</span>
              <span>{formatPrice(itemsSubtotalCents)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping &amp; handling</span>
              <span>{formatPrice(shippingCents)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated tax</span>
              <span>{formatPrice(taxCents)}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Order total</span>
              <span>{formatPrice(orderTotalCents)}</span>
            </div>

            <button
              type="submit"
              className="place-order-btn"
              disabled={!items || items.length === 0}
            >
              Place your order
            </button>
          </section>

          <section className="items-card">
            <h4>Items in your cart</h4>
            <ul>
              {items.map((item) => {
                const id = getItemId(item);
                const priceCents = getPriceCents(item);
                return (
                  <li key={id} className="item-row">
                    <div className="item-name">
                      {item.name} × {item.quantity}
                    </div>
                    <div className="item-price">
                      {formatPrice(priceCents * item.quantity)}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </form>
    </div>
  );
}

export default CheckoutPage;
