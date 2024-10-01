import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../css/signUp.css"; // Ensure this path is correct

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null); // State to handle errors

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Corrected the API URL to point to your backend server
      const response = await axios.post('http://localhost:3001/users/signUp', formData);
      console.log("User signed up successfully:", response.data);
      navigate('/signin'); // Navigate to SignIn after successful sign-up
    } catch (error) {
      console.error("Sign up error:", error.response?.data);
      setError(error.response?.data.message || "Something went wrong. Please try again."); // Set the error message
    }
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src="img/logo1.png" alt="logo" />
      </div>
      <div className="text-center mt-3 name">
        Gold Chit Fund Management <br /> (Sign Up)
      </div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-user"></span>
          <input
            type="text"
            name="fullName"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-envelope"></span>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="btn mt-3">
          Sign Up
        </button>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default SignUp;
