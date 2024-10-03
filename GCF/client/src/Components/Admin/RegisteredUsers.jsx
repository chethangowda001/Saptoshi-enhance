// src/Components/Admin/RegisteredUsers.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "../../css/RegisteredUsers.css"; // Ensure your CSS file is updated accordingly
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Using navigate hook
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  // State for Delete Modal
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // State for Edit Modal
  const [editUserData, setEditUserData] = useState({
    id: null,
    userName: '',
    userPhoneNo: '',
    userEmail: '',
    address: '',
    aadharNo: '',
    panNo: '',
    profileImageURL: '',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  
// Pagination: Calculate the current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Pagination: Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/participants/all');
      setUsers(response.data);
      toast.success('Users fetched successfully!');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users.');
      toast.error('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userPhoneNo.includes(searchTerm)
  );

  // Format date to 'DD/MM/YYYY'
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Open Delete Modal
  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/participants/${deleteUserId}/delete`);
      setUsers(prevUsers => prevUsers.filter(user => user._id !== deleteUserId));
      toast.success('Participant deleted successfully!');
    } catch (error) {
      console.error('Error deleting participant:', error);
      toast.error('Failed to delete participant.');
    } finally {
      setShowDeleteModal(false);
      setDeleteUserId(null);
    }
  };

  // Open Edit Modal
  const handleEditClick = (user) => {
    setEditUserData({
      id: user._id,
      userName: user.userName,
      userPhoneNo: user.userPhoneNo,
      userEmail: user.userEmail,
      address: user.address,
      aadharNo: user.aadharNo,
      panNo: user.panNo,
      profileImageURL: user.profileImageURL,
    });
    setShowEditModal(true);
  };

  // Handle Edit Form Change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { id, ...updatedData } = editUserData;
  
    try {
      // Optimistic UI update
      setUsers(prevUsers => prevUsers.map(user => 
        user._id === id ? { ...user, ...updatedData } : user
      ));
  
      await axios.put(`http://localhost:3001/participants/${id}/update`, updatedData);
      toast.success('Participant updated successfully!');
    } catch (error) {
      console.error('Error updating participant:', error);
      toast.error('Failed to update participant.');
    } finally {
      setShowEditModal(false);
      setEditUserData({
        id: null,
        userName: '',
        userPhoneNo: '',
        userEmail: '',
        address: '',
        aadharNo: '',
        panNo: '',
        profileImageURL: '',
      });
    }
  };
  

  return (
    <div className="container mt-5">
      <ToastContainer /> {/* Container for Toast Notifications */}
      <h3 className="mb-4 text-center">Registered Users</h3>

      {/* Search Bar */}
      <div className="row mb-3">
        <div className="col-md-6 offset-md-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or phone number"
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search"
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i> {/* Bootstrap Icons */}
            </span>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading users...</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th scope="col">Sl No.</th>
                <th scope="col">User Name</th>
                <th scope="col">Phone No.</th>
                <th scope="col">Email</th>
                <th scope="col">Address</th>
                <th scope="col">Aadhar No.</th>
                <th scope="col">PAN No.</th>
                <th scope="col">Profile Photo</th>
                <th scope="col">Created Date</th>
                <th scope="col">Actions</th> {/* Add a header for actions */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <Link to={`/participant-details/${user._id}`} className="text-decoration-none">
                        {user.userName}
                      </Link>
                    </td>
                    <td>{user.userPhoneNo}</td>
                    <td>{user.userEmail}</td>
                    <td>{user.address}</td>
                    <td>{user.aadharNo}</td>
                    <td>{user.panNo}</td>
                    <td>
  {user.profileImageURL ? (
    <img 
      src={user.profileImageURL.startsWith("http") ? user.profileImageURL : `http://localhost:3001${user.profileImageURL}`} 
      alt={`${user.userName}'s profile`} 
      className="img-thumbnail profile-img"
    />
  ) : (
    <span className="text-muted">No image</span>
  )}
</td>

                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      {/* View Details Button */}
                      <button 
                        className="btn btn-info btn-sm me-2"
                        onClick={() => navigate(`/participants/${user._id}/bids`)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>

                      {/* Edit Button */}
                      <button 
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(user)}
                        title="Edit Participant"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>

                      {/* Delete Button */}
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(user._id)}
                        title="Delete Participant"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this participant?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Participant Modal */}
      {showEditModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Participant Details</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="userName" className="form-label">User Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="userName" 
                        name="userName"
                        value={editUserData.userName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="userPhoneNo" className="form-label">Phone No.</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="userPhoneNo" 
                        name="userPhoneNo"
                        value={editUserData.userPhoneNo}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="userEmail" className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="userEmail" 
                        name="userEmail"
                        value={editUserData.userEmail}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="address" 
                        name="address"
                        value={editUserData.address}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="aadharNo" className="form-label">Aadhar No.</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="aadharNo" 
                        name="aadharNo"
                        value={editUserData.aadharNo}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="panNo" className="form-label">PAN No.</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="panNo" 
                        name="panNo"
                        value={editUserData.panNo}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="profileImageURL" className="form-label">Profile Image URL</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="profileImageURL" 
                        name="profileImageURL"
                        value={editUserData.profileImageURL}
                        onChange={handleEditChange}
                      />
                      <small className="form-text text-muted">Leave blank if you don't want to change the profile image.</small>
                    </div>
                    {/* Add more fields as necessary */}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredUsers;
