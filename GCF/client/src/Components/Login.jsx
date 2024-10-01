// src/Components/Login.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import "../css/Login.css";
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import Font Awesome Icons

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '', rememberMe: false });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Corrected the API URL to point to your backend server
      const response = await axios.post('http://localhost:3001/users/signin', credentials);
      console.log("User signed in successfully:", response.data);
      // Optionally, store the token or user data
      localStorage.setItem('token', response.data.token);
      if (credentials.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      navigate('/dashboard'); // Navigate to the dashboard after successful sign-in
    } catch (error) {
      console.error("Sign in error:", error.response?.data);
      setError(error.response?.data?.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="login-card card shadow-sm">
        <div className="card-body">
          <div className="text-center mb-4">
            <img src="/img/logo1.png" alt="Logo" className="logo-img mb-2" />
            <h4 className="card-title">Gold Chit Fund Management</h4>
            <p className="card-subtitle text-muted">(Only Admins)</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text" id="email-addon">
                  <i className="fas fa-user"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  id="email"
                  value={credentials.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  aria-describedby="email-addon"
                  required
                />
              </div>
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text" id="password-addon">
                  <i className="fas fa-key"></i>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  id="password"
                  value={credentials.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                  aria-describedby="password-addon"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="form-group form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Login'}
            </button>
          </form>
          <div className="mt-3 text-center">
            <Link to="/signup" className="text-decoration-none">
              Don't have an account? Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
