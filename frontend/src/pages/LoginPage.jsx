// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import './RegisterPage.css'; 

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg('❌ Invalid username or password.');
        return;
      }

      
      const jwtToken = data.token;
      const userInfo = { username: data.username || username };

      
      login(userInfo, jwtToken);

      setSuccessMsg('✅ Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/products');
      }, 800);
    } catch (err) {
      setErrorMsg('❌ Network error. Please try again later.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Login</h2>

      {errorMsg && <div className="error-message">{errorMsg}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}

      <form onSubmit={handleLogin}>
        <input
          className="register-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          className="register-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="register-btn" type="submit">
          Login
        </button>
      </form>

      <div className="register-login-text">
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default LoginPage;
