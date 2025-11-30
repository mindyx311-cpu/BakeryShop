// src/api/order.js

const BASE_URL = '/api';

// 下单：从购物车创建订单
export async function createOrder(cartItems) {
  const payload = {
    items: cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  // TODO: 以后接 JWT 时再加 token
  // const token = localStorage.getItem('token');
  // if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to create order');
  }

  return res.json(); // 后端返回 OrderResponse
}

// 获取当前用户的订单列表：GET /api/orders
export async function fetchMyOrders() {
  const res = await fetch(`${BASE_URL}/orders`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to load orders');
  }

  return res.json(); // List<OrderResponse>
}

// 支付订单：POST /api/orders/{id}/pay
export async function payOrder(orderId) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to pay order');
  }

  return res.json();
}

// 取消订单：POST /api/orders/{id}/cancel
export async function cancelOrder(orderId) {
  const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to cancel order');
  }

  return res.json();
}
