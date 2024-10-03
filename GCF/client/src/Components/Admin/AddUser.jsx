// src/Components/Admin/AddUser.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Tooltip, Card, CardContent, CircularProgress } from '@mui/material'; // Material UI components
import '../../css/AddUser.css'; // Ensure the CSS file is updated accordingly
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddUser = () => {
  const [newUser, setNewUser] = useState({
    userName: '',
    userPhoneNo: '',
    userEmail: '',
    address: '',
    aadharNo: '',
    panNo: '',
    profileImage: null, // For file upload
  });
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewUser((prevUser) => ({
      ...prevUser,
      profileImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('userName', newUser.userName);
    formData.append('userPhoneNo', newUser.userPhoneNo);
    formData.append('userEmail', newUser.userEmail);
    formData.append('address', newUser.address);
    formData.append('aadharNo', newUser.aadharNo);
    formData.append('panNo', newUser.panNo);
    if (newUser.profileImage) {
      formData.append('profileImage', newUser.profileImage);
    }

    try {
      await axios.post('http://localhost:3001/participants/new', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewUser({
        userName: '',
        userPhoneNo: '',
        userEmail: '',
        address: '',
        aadharNo: '',
        panNo: '',
        profileImage: null,
      });
      toast.success('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer /> {/* Toast notification container */}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <Card className="shadow-lg">
            <CardContent>
              <h3 className="text-center mb-4">Add New User</h3>
              <form onSubmit={handleSubmit}>
                {/* User Name */}
                <TextField
                  label="User Name"
                  name="userName"
                  value={newUser.userName}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                {/* User Phone Number */}
                <TextField
                  label="User Phone Number"
                  name="userPhoneNo"
                  value={newUser.userPhoneNo}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                {/* User Email */}
                <TextField
                  label="User Email"
                  name="userEmail"
                  value={newUser.userEmail}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                  type="email"
                />
                {/* Address */}
                <TextField
                  label="Address"
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                />
                {/* Aadhar Number */}
                <TextField
                  label="Aadhar Number"
                  name="aadharNo"
                  value={newUser.aadharNo}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                {/* PAN Number */}
                <TextField
                  label="PAN Number"
                  name="panNo"
                  value={newUser.panNo}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                {/* Profile Image */}
                <div className="form-group my-3">
                  <label htmlFor="profileImage" className="form-label">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
              {/* Navigate to Registered Users */}
              <div className="d-flex justify-content-between mt-3">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/dashboard/registeredusers')}
                >
                  Go to Registered Users
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
