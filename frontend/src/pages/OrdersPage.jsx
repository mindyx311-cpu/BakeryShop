// src/pages/OrdersPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import useAuth from '../hooks/useAuth.js';
import './OrdersPage.css';


import baguetteImg from '../assets/Baguette.jpg';
import chocolateCakeImg from '../assets/chocolate cake.jpg';
import chocolateToastImg from '../assets/chocolate-toast.jpg';
import croissantsImg from '../assets/croissants.jpg';
import garlicBreadImg from '../assets/Garlic-Bread.jpg';
import wheatLoafImg from '../assets/wheat Loaf.jpg';


function getProductImage(name) {
  if (!name) return null;
  const lower = name.toLowerCase();

  if (lower.includes('baguette')) return baguetteImg;
  if (lower.includes('chocolate cake')) return chocolateCakeImg;
  if (lower.includes('chocolate')) return chocolateToastImg;
  if (lower.includes('croissant')) return croissantsImg;
  if (lower.includes('garlic')) return garlicBreadImg;
  if (lower.includes('wheat')) return wheatLoafImg;

  return null;
}

function OrdersPage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const formatMoney = (value) => {
    if (value == null) return '0.00';
    const num = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  const fetchOrders = async () => {
    if (!user) {
      setLoading(false);
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await fetch(
        `http://localhost:8080/api/orders?username=${encodeURIComponent(
          user.username
        )}`,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders', err);
      setErrorMsg('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const totalOrdersText = useMemo(() => {
    if (!orders || orders.length === 0) return '0 orders placed';
    if (orders.length === 1) return '1 order placed';
    return `${orders.length} orders placed`;
  }, [orders]);

  
  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    return [...orders].sort((a, b) => {
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return db - da;
    });
  }, [orders]);

  if (!user) {
    return (
      <div className="orders-page">
        <h2>Your Orders</h2>
        <p>Please log in first.</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      
      <div className="orders-top-bar">
        <div>
          <h2 className="orders-title">Your Orders</h2>
          <div className="orders-count">{totalOrdersText}</div>
        </div>

        <div className="orders-controls">
          <select className="orders-filter-select" defaultValue="3m">
            <option value="3m">past 3 months</option>
            <option value="6m">past 6 months</option>
            <option value="1y">past year</option>
          </select>
          <div className="orders-search">
            <input
              type="text"
              placeholder="Search all orders"
              className="orders-search-input"
            />
            <button className="orders-search-button">Search Orders</button>
          </div>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && errorMsg && (
        <div className="orders-error">❌ {errorMsg}</div>
      )}

      {!loading && !errorMsg && sortedOrders.length === 0 && (
        <p>You have no orders yet.</p>
      )}

      {!loading && !errorMsg && sortedOrders.length > 0 && (
        <div className="orders-list">
          {sortedOrders.map((order) => {
            const createdDate = order.createdAt
              ? new Date(order.createdAt)
              : null;

            const placedText = createdDate
              ? createdDate.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';

            
            const arrivingText = (() => {
              if (!createdDate) return order.status || 'Arriving soon';
              const d = new Date(createdDate);
              d.setDate(d.getDate() + 3);
              const weekday = d.toLocaleDateString(undefined, {
                weekday: 'long',
              });
              return `Arriving ${weekday}`;
            })();

            const totalText = `$${formatMoney(order.totalAmount)}`;
            const shipToText = user?.username || order.username || '—';

            return (
              <div key={order.id} className="order-card">
                
                <div className="order-card-header">
                  <div className="order-meta-group">
                    <div className="order-meta-label">ORDER PLACED</div>
                    <div className="order-meta-value">
                      {placedText || '—'}
                    </div>
                  </div>
                  <div className="order-meta-group">
                    <div className="order-meta-label">TOTAL</div>
                    <div className="order-meta-value">{totalText}</div>
                  </div>
                  <div className="order-meta-group">
                    <div className="order-meta-label">SHIP TO</div>
                    <div className="order-meta-value">{shipToText}</div>
                  </div>
                  <div className="order-meta-right">
                    <div className="order-id-text">
                      ORDER # {order.id}
                    </div>
                    <button className="order-link-button">
                      View order details
                    </button>
                  </div>
                </div>

                
                <div className="order-card-body">
                  <div className="order-status-column">
                    <div className="order-status-main">{arrivingText}</div>
                    {order.status && (
                      <div className="order-status-sub">
                        {order.status}
                      </div>
                    )}
                    <div className="order-actions-column">
                      <button className="order-primary-button">
                        Track package
                      </button>
                      <button className="order-secondary-button">
                        View or edit order
                      </button>
                      <button className="order-secondary-button">
                        Write a product review
                      </button>
                    </div>
                  </div>

                  <div className="order-items-column">
                    {order.items &&
                      order.items.map((item) => {
                        const name =
                          item.productName ||
                          item.product?.name ||
                          'Item';

                        const price = item.price
                          ? `$${formatMoney(item.price)}`
                          : '';

                        const qty = item.quantity || 1;

                        const imageUrl = getProductImage(name);

                        return (
                          <div
                            key={item.id}
                            className="order-item-row"
                          >
                            <div className="order-item-image-wrapper">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={name}
                                  className="order-item-image"
                                />
                              ) : (
                                <div className="order-item-image-placeholder" />
                              )}
                            </div>
                            <div className="order-item-info">
                              <div className="order-item-name">
                                {name}
                              </div>
                              <div className="order-item-meta">
                                <span>Qty: {qty}</span>
                                {price && (
                                  <span className="order-item-price">
                                    {price}
                                  </span>
                                )}
                              </div>
                              <button className="order-link-button">
                                Buy it again
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
