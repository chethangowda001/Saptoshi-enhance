// src/Components/Admin/BidModal.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../css/BidModal.css";

const BidModal = ({ show, onClose, bidData, nearestBid, onBidStart }) => {
  const [winnerId, setWinnerId] = useState('');
  const [bidValue, setBidValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentNearestBid, setCurrentNearestBid] = useState(nearestBid); // State to hold the current nearestBid
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    setCurrentNearestBid(nearestBid); // Update currentNearestBid whenever nearestBid changes
    setWinnerId(''); // Reset winner selection when modal opens
    setBidValue(''); // Reset bid value when modal opens
    setError(null); // Clear previous errors
  }, [nearestBid, show]);

  const handleWinnerChange = (e) => {
    setWinnerId(e.target.value);
  };

  const handleBidValueChange = (e) => {
    setBidValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (isSubmitting) {
      return; // Prevent multiple submissions
    }
    setIsSubmitting(true);
    setError(null); // Reset any previous errors

    // Validate inputs
    if (!winnerId) {
      alert('Please select a bid winner.');
      setIsSubmitting(false);
      return;
    }

    if (!bidValue || bidValue <= 0) {
      alert('Please enter a valid bid value.');
      setIsSubmitting(false);
      return;
    }

    const selectedWinner = bidData.users.find((user) => user._id === winnerId);
    if (!selectedWinner) {
      alert('Selected winner not found');
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    // Calculate bid stake and payout
    const bidStake = bidValue / bidData.MonthDuration;
    const bidPayout = bidValue - bidStake;

    // Construct payment status for all users
    const paymentStatus = bidData.users.map((user) => ({
      u_id: user._id,
      userName: user.userName,
      payment: user._id === winnerId ? 0 : bidStake,
      payed: false,
    }));

    // Construct the updated bid object
    const updatedBid = {
      BidWinner: {
        userName: selectedWinner.userName,
        phoneNumber: selectedWinner.userPhoneNo,
      },
      BidValue: bidValue,
      BidStake: bidStake,
      PaymentStatus: paymentStatus,
      BidPayOut: bidPayout,
      BidStart: true,
    };

    try {
      console.log(`Submitting start bid for Bid No.: ${updatedBid.BidNo}`);
      // First API call: Update the bid details
      const response = await axios.put(
        `http://localhost:3001/bids/${bidData._id}/update-bid/${currentNearestBid.BidNo}`,
        updatedBid
      );

      console.log('Update Bid Response:', response);

      if (response.status === 200) {
        // Second API call: Update the selected user's bid details
        const userUpdateResponse = await axios.put(
          `http://localhost:3001/bids/${bidData._id}/users/${selectedWinner._id}`,
          {
            BidWinNo: currentNearestBid.BidNo,
            BidValue: bidValue,
            BidPayOut: bidPayout,
          }
        );

        console.log('Update User Response:', userUpdateResponse);

        if (userUpdateResponse.status === 200) {
          onBidStart(updatedBid); // Notify parent component
          onClose(); // Close the modal
          alert('Bid started successfully!');
        } else {
          console.error('Failed to update user:', userUpdateResponse.data.message);
          alert('Failed to update user. Please check the console for details.');
        }
      } else {
        console.error('Unexpected response status:', response.status);
        alert('Failed to start bid. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error starting bid:', error.response || error.message);
      if (error.response) {
        // Backend responded with an error
        alert(`Failed to start bid: ${error.response.data.message || 'Unknown error.'}`);
      } else if (error.request) {
        // Request was made but no response received
        alert('No response from server. Please check your network connection.');
      } else {
        // Something else happened
        alert(`Error: ${error.message}`);
      }
      setError('Failed to start bid.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-modal="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {error && (
            <div className="alert alert-danger m-3" role="alert">
              {error}
            </div>
          )}
          <div className="modal-header">
            <h5 className="modal-title">Start Bid</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Bid Winner Selection */}
              <div className="mb-3">
                <label htmlFor="bidWinner" className="form-label"><strong>Bid Winner</strong></label>
                <select
                  id="bidWinner"
                  className="form-select"
                  value={winnerId}
                  onChange={handleWinnerChange}
                  required
                >
                  <option value="">Select Winner</option>
                  {bidData.users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.userName} - {user.userPhoneNo}
                    </option>
                  ))}
                </select>
              </div>
              {/* Bid Value Input */}
              <div className="mb-3">
                <label htmlFor="bidValue" className="form-label"><strong>Bid Value</strong></label>
                <input
                  type="number"
                  id="bidValue"
                  className="form-control"
                  value={bidValue}
                  onChange={handleBidValueChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="Enter bid value"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  'Start Bid'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BidModal;
