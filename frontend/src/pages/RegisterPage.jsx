// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css'; 

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
       
        setErrorMsg(data.error || 'Registration failed');
        return;
      }

      setSuccessMsg('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 800);
    } catch (err) {
      setErrorMsg('❌ Network error. Please try again later.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>

      {errorMsg && <div className="error-message">{errorMsg}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}

      <form onSubmit={handleRegister}>
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
          Sign up
        </button>
      </form>

      <div className="register-login-text">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default RegisterPage;
