// src/Components/Admin/OngoingBids.js

import React, { useState, useEffect } from 'react';
import "../../css/OngoingBids.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OngoingBids = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [bidsData, setBidsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3001/bids/ongoing-bids');
        setBidsData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch ongoing bids. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBids = bidsData.filter((bid) =>
    Object.values(bid)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleViewBid = (bidId) => {
    navigate(`/dashboard/bid/${bidId}`);
  };

  const handleViewPaymentStatus = (bidId) => {
    navigate(`/dashboard/payment-status/${bidId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="ongoing-bids-container">
      <h3>Ongoing Bids</h3>
      <div className="search mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Bid No., Ad, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Sl. No</th>
                <th>Bid No.</th>
                <th>Start</th>
                <th>End</th>
                <th>No. of Participants</th>
                <th>Bid Size</th>
                <th>Ad</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid, index) => (
                  <tr key={bid._id}>
                    <td>{index + 1}</td>
                    <td>{bid._id}</td>
                    <td>{formatDate(bid.StartDate)}</td>
                    <td>{formatDate(bid.EndDate)}</td>
                    <td>{bid.ParticipantsCount}</td>
                    <td>{bid.BidSize}</td>
                    <td>{bid.AD}</td>
                    <td>
                      <button className="btn btn-info btn-sm me-2" onClick={() => handleViewBid(bid._id)}>
                        View Bid
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleViewPaymentStatus(bid._id)}>
                        View Payment Status
                      </button> 
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No ongoing bids found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OngoingBids;
