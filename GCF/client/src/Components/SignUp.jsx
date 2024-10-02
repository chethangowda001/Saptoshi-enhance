// src/Components/Auth/SignUp.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "../css/signUp.css"; // Ensure this path is correct
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null); // State to handle errors
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle form submission
  const [showPassword, setShowPassword] = useState(false); // State to handle password visibility

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null); // Reset previous errors

    try {
      // Corrected the API URL to point to your backend server
      const response = await axios.post('http://localhost:3001/users/signUp', formData);
      console.log("User signed up successfully:", response.data);
      toast.success('Sign up successful! Redirecting to sign in...');
      // Redirect after a short delay to allow users to read the toast
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (error) {
      console.error("Sign up error:", error.response?.data);
      setError(error.response?.data.message || "Something went wrong. Please try again."); // Set the error message
      toast.error(error.response?.data.message || "Sign up failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <ToastContainer /> {/* Container for Toast Notifications */}
      <div className="card shadow-lg" style={{ width: '22rem' }}>
        <div className="card-body p-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <img src="/img/logo1.png" alt="logo" className="img-fluid" style={{ maxWidth: '100px' }} />
          </div>
          {/* Title */}
          <h4 className="card-title text-center mb-4">Gold Chit Fund Management</h4>
          <h5 className="card-subtitle mb-3 text-center text-muted">(Sign Up)</h5>
          
          {/* Sign Up Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <i className="bi bi-eye-slash-fill"></i> : <i className="bi bi-eye-fill"></i>}
                </button>
              </div>
              <div className="form-text">Password must be at least 8 characters long.</div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>

            {/* Error Message */}
            {error && <div className="mt-3 alert alert-danger text-center">{error}</div>}
          </form>

          {/* Redirect to Sign In */}
          <div className="text-center mt-4">
            <p className="mb-0">Already have an account? <Link to="/signin" className="text-primary">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
