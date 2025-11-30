// src/pages/ProductsPage.jsx
import React, { useState } from 'react';
import useCart from '../hooks/useCart.js';
import './ProductsPage.css';
import baguetteImg from '../assets/Baguette.jpg';
import croissantImg from '../assets/croissants.jpg';
import chocolateToastImg from '../assets/chocolate-toast.jpg';
import chocolateCakeImg from '../assets/chocolate cake.jpg';
import garlicBreadImg from '../assets/Garlic-Bread.jpg';
import wheatLoafImg from '../assets/wheat Loaf.jpg';


const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Baguette',
    description:
      'Classic French baguette, crispy outside and soft inside, freshly baked daily.',
    price: 3.5,
    stock: 50,
    image: baguetteImg,
  },
  {
    id: 2,
    name: 'Butter Croissant',
    description:
      'Flaky butter croissant with rich layers, perfect for breakfast.',
    price: 3.5,
    stock: 40,
    image: croissantImg,
  },
  {
    id: 3,
    name: 'Chocolate Toast',
    description:
      'Soft toast with chocolate filling, perfect for afternoon tea.',
    price: 3.5,
    stock: 30,
    image: chocolateToastImg,
  },
  {
    id: 4,
    name: 'Chocolate Cake',
    description: 'Rich dark chocolate cake with moist texture.',
    price: 4.5,
    stock: 20,
    image: chocolateCakeImg,
  },
  {
    id: 5,
    name: 'Garlic Bread',
    description: 'Toasted baguette slices with garlic butter and herbs.',
    price: 3.0,
    stock: 25,
    image: garlicBreadImg,
  },
  {
    id: 6,
    name: 'Whole Wheat Loaf',
    description: 'Healthy whole wheat bread, great for sandwiches.',
    price: 4.0,
    stock: 18,
    image: wheatLoafImg,
  },
];

function ProductsPage() {
  const { addToCart } = useCart();

 
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  
  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
    
      return;
    }

    
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: p.stock - 1 } : p
      )
    );

    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceCents: Math.round(product.price * 100),
    });
  };

  return (
    <div className="products-page">
      
      <section className="hero">
        <div className="hero-text">
          <h1>Freshly Baked Every Day</h1>
          <p>
            Handcrafted breads and pastries, baked in small batches with real
            butter and simple ingredients.
          </p>
        </div>
      </section>

      
      <section className="products-section">
        <h2>Our Breads</h2>

        <div className="products-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
              </div>

              <div className="product-content">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-meta">
                  <div className="product-price">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="product-stock">
                    Stock: {product.stock}
                  </div>
                </div>

                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to cart' : 'Sold out'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductsPage;
