import React, { useState } from 'react';
import axios from 'axios';
import '../../css/AddUser.css'; // Import the custom CSS

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
      alert('User added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="userName">User Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    name="userName"
                    value={newUser.userName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userPhoneNo">User Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userPhoneNo"
                    name="userPhoneNo"
                    value={newUser.userPhoneNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="userEmail">User Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="userEmail"
                    name="userEmail"
                    value={newUser.userEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={newUser.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="aadharNo">Aadhar Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="aadharNo"
                    name="aadharNo"
                    value={newUser.aadharNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="panNo">PAN Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="panNo"
                    name="panNo"
                    value={newUser.panNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profileImage">Profile Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="profileImage"
                    name="profileImage"
                    onChange={handleFileChange}
                  />
                </div>
                <button type="submit" className="btn btn-success mt-3">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
