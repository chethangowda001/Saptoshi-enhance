import React, { useState, useEffect } from 'react';
import "../../css/OngoingBids.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BidPage from './BidPage'; // Assuming you have a BidPage component

const OngoingBids = ({ setActivePage, setActiveBidId, activeBidId }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [bidsData, setBidsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bids/ongoing-bids');
        setBidsData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
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
    setActiveBidId(bidId);
    navigate(`/dashboard/bid/${bidId}`);
    setActivePage(<BidPage activeBidId={activeBidId} />);
  };

  const handleViewPaymentStatus = (bidId) => {
    setActiveBidId(bidId);
    navigate(`/dashboard/payment-status/${bidId}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="ongoing-bids-container">
      <h3>Ongoing Bids</h3>
      <div className="search">
        <input
          type="text"
          placeholder="Search by Bid No., Ad, etc."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-dark">Search</button>
      </div>

      <table className="table">
        <thead>
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
          {filteredBids.map((bid, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{bid._id}</td>
              <td>{formatDate(bid.StartDate)}</td>
              <td>{formatDate(bid.EndDate)}</td>
              <td>{bid.ParticipantsCount}</td>
              <td>{bid.BidSize}</td>
              <td>{bid.AD}</td>
              <td>
                <button className="btn btn-info" onClick={() => handleViewBid(bid._id)}>
                  View Bid
                </button>
                <button className="btn btn-info" onClick={() => handleViewPaymentStatus(bid._id)} style={{ marginLeft: '10px' }}>
                  View Payment Status
                </button> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OngoingBids;
