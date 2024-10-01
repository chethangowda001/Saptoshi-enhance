// components/ParticipantDetailsWithBids.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/ParticipantDetails.css'; // Ensure this path is correct

const ParticipantDetailsWithBids = () => {
  const { id } = useParams(); // Extract 'id' from URL parameters
  const navigate = useNavigate(); // For navigation
  const [participantData, setParticipantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Participant ID:', id); // Debugging log

  // Fetch participant details along with bids
  useEffect(() => {
    // Check if 'id' exists
    if (!id) {
      console.error('Participant ID is missing in the URL.');
      setError('Participant ID is missing in the URL.');
      setLoading(false);
      return;
    }

    console.log('Fetching participant details for ID:', id);

    const fetchParticipantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/participants/${id}/bids`);
        console.log('API Response:', response);

        if (response.data.success) {
          setParticipantData(response.data);
          console.log('Participant Data:', response.data);
        } else {
          setError(response.data.message || 'Failed to fetch participant data');
          console.error('Error Message:', response.data.message);
        }
      } catch (err) {
        console.error("Error fetching participant details:", err);
        setError("Error fetching participant details");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantDetails();
  }, [id]);

  // Handle navigation back to registered users
  const handleBack = () => {
    navigate('/dashboard/registeredusers');
  };

  // Handle navigation to Participant Details
  const handleViewParticipantDetails = () => {
    navigate(`/participant-details/${id}`);
  };

  // Render loading state
  if (loading) {
    return (
      <div className="container mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  // Render when no data is available
  if (!participantData) {
    return (
      <div className="container mt-4">
        <p>No participant data available</p>
      </div>
    );
  }

  const { participantDetails, bids } = participantData;

  return (
    <div className="container mt-5 pt-5">
      <div className="card">
        <div className="card-header">
          <h2>Participant Details with Bids</h2>
        </div>
        <div className="card-body">
          {/* Participant Information */}
          <div className="row mb-4">
            <div className="col-md-3">
              {participantDetails.profileImageURL ? (
                <img
                  src={`http://localhost:3001${participantDetails.profileImageURL}`}
                  alt={`${participantDetails.userName}'s profile`}
                  className="img-fluid rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/path/to/default-image.png'; // Provide a default image path
                  }}
                />
              ) : (
                <div className="text-center">No Image Available</div>
              )}
            </div>
            <div className="col-md-9">
              <h4>{participantDetails.userName}</h4>
              <p><strong>Email:</strong> {participantDetails.userEmail}</p>
              <p><strong>Phone No:</strong> {participantDetails.userPhoneNo}</p>
              <p><strong>Address:</strong> {participantDetails.address}</p>
              <p><strong>Aadhar No:</strong> {participantDetails.aadharNo}</p>
              <p><strong>PAN No:</strong> {participantDetails.panNo}</p>
              <p><strong>Document:</strong> 
                {participantDetails.document ? (
                  <a href={`http://localhost:3001/${participantDetails.document}`} target="_blank" rel="noopener noreferrer">View Document</a>
                ) : (
                  'No Document'
                )}
              </p>
              <p><strong>Created At:</strong> {new Date(participantDetails.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bids Table */}
          <h3 className="mt-4">Bids</h3>
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Bid No</th>
                <th>Bid Winner</th>
                <th>Winner Phone</th>
                <th>Bid Value</th>
                <th>Bid PayOut</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bids.length > 0 ? (
                bids.map((bid, index) => (
                  <tr key={index}>
                    <td>{bid.Bids.BidNo}</td>
                    <td>{bid.Bids.BidWinner?.userName || "Unknown"}</td>
                    <td>{bid.Bids.BidWinner?.phoneNumber || "Unknown"}</td>
                    <td>{bid.Bids.BidValue}</td>
                    <td>{bid.users.BidPayOut.toFixed(2)}</td>
                    <td>
                      {bid.Bids.PaymentStatus.length > 0 ? (
                        <ul className="list-unstyled mb-0">
                          {bid.Bids.PaymentStatus.map((payment, idx) => (
                            <li key={idx}>
                              <strong>{payment.userName}:</strong> {payment.payment} ({payment.payed ? 'Paid' : 'Not Paid'})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No payment data"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">No bids available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-primary" onClick={handleBack}>
              Back to Registered Users
            </button>
            <button className="btn btn-secondary" onClick={handleViewParticipantDetails}>
              View Participant Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetailsWithBids;
