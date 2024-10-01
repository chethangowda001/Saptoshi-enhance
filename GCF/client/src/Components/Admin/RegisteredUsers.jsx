import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import "../../css/RegisteredUsers.css";

const RegisteredUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Using navigate hook

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/participants/all');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userPhoneNo.includes(searchTerm)
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="registered-users-container">
      <h3>Registered Users</h3>
      <input
        type="text"
        placeholder="Search by name or phone number"
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="registered-users-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>User Name</th>
            <th>Phone No.</th>
            <th>Email</th>
            <th>Address</th>
            <th>Aadhar No.</th>
            <th>PAN No.</th>
            <th>Profile Photo</th>
            <th>Created Date</th>
            <th>Actions</th> {/* Add a header for actions */}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/participant-details/${user._id}`}>{user.userName}</Link>
              </td>
              <td>{user.userPhoneNo}</td>
              <td>{user.userEmail}</td>
              <td>{user.address}</td>
              <td>{user.aadharNo}</td>
              <td>{user.panNo}</td>
              <td>
                {user.profileImageURL ? (
                  <img 
                    src={`http://localhost:3001${user.profileImageURL}`} 
                    alt={`${user.userName}'s profile`} 
                    width="50" 
                    height="50" 
                  />
                ) : (
                  'No image'
                )}
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                {/* Button to view ParticipantDetailsWithBids */}
                <button 
                  className="btn btn-info" 
                  onClick={() => navigate(`/participants/${user._id}/bids`)}
                >
                  View Complete Details with Bids
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredUsers;
