# Bakery Shop 🥐

A full-stack bakery e-commerce demo built with **Spring Boot** (backend) and **React + Vite** (frontend).

Users can:

- Browse bakery products
- Add items to a shopping cart
- Adjust quantities and save items for later
- Go through a checkout flow
- View order success and order history (per logged-in user)

> This repo is intended as a portfolio/demo project to showcase full-stack skills (Java, Spring Boot, REST API, React, state management, integration with a database, etc.).

---

## ✨ Features

### Backend (Spring Boot)

- Java 21 + Spring Boot 3
- RESTful APIs for:
  - User registration & login
  - Product listing
  - Checkout and order creation
  - Order history per user
- JPA / Hibernate integration with a relational database (e.g. MySQL)
- Entity & DTO model for:
  - `User`, `Product`, `Order`, `OrderItem`, etc.
- Price stored as **cents** (integer) in the database to avoid floating-point issues
- Global exception handling (e.g. `UsernameAlreadyExistsException`)
- Simple JWT-style / token-based auth flow (frontend sends token on requests)

### Frontend (React + Vite)

- React SPA created with Vite
- React Router for navigation between:
  - Products page
  - Cart page
  - Checkout page
  - Order success page
  - Orders (order history) page
  - Login / Register pages
- Context-based state management:
  - `AuthContext` – login state & user info
  - `CartContext` – cart items, quantities, save-for-later list, checkout
- Custom hooks:
  - `useAuth` – access auth state & actions
  - `useCart` – access cart state & actions
- Clean CSS module styling for each page (`CartPage.css`, `CheckoutPage.css`, `OrdersPage.css`, etc.)

---

## 🧱 Tech Stack

**Backend**

- Java 21
- Spring Boot 3
- Spring Web / Spring MVC
- Spring Data JPA
- (MySQL or other relational DB)
- Maven (or Maven Wrapper `mvnw`)

**Frontend**

- React
- Vite
- React Router
- Fetch API
- CSS

---

## 📂 Project Structure

```text
Project/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/bakeryshop/backend
│   │   ├── config/          # CORS & security configuration
│   │   ├── exception/       # GlobalExceptionHandler, custom exceptions
│   │   ├── order/           # Order, OrderItem, DTOs, controller, service, repo
│   │   ├── product/         # Product entity, controller, repository
│   │   ├── security/        # JWT service / security components
│   │   ├── service/         # UserService, etc.
│   │   └── user/            # User entity, UserRepository
│   └── src/main/resources/
│       └── application.properties  # DB config, server port, etc.
│
└── frontend/                # React + Vite frontend
    ├── src/
    │   ├── assets/          # Images (bread, cakes, etc.)
    │   ├── components/      # Header, Footer, ProductCard, ProtectedRoute...
    │   ├── context/         # AuthContext, CartContext
    │   ├── hooks/           # useAuth, useCart
    │   ├── pages/           # ProductsPage, CartPage, CheckoutPage, OrdersPage...
    │   ├── styles/          # Page-specific CSS files
    │   └── main.jsx         # App entry
    └── vite.config.js
