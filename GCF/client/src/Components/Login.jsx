import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Corrected the API URL to point to your backend server
      const response = await axios.post('http://localhost:3001/users/signin', credentials);
      console.log("User signed in successfully:", response.data);
      navigate('/dashboard'); // Navigate to the dashboard after successful sign-in
    } catch (error) {
      console.error("Sign in error:", error.response?.data);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src="img/logo1.png" alt="logo" />
      </div>
      <div className="text-center mt-3 name">
        Gold Chit Fund Management <br /> (Only Admins)
      </div>
      <form className="p-3 mt-3" onSubmit={handleSubmit}>
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="email"
            name="email"
            id="email"
            value={credentials.email}
            onChange={onChange}
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
            value={credentials.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="btn mt-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
