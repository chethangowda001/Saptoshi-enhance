import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BidModal from './BidModal';
import "../../css/BidPage.css";

const BidPage = () => {
  const { id } = useParams();
  const [bidData, setBidData] = useState(null);
  const [nearestBid, setNearestBid] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidClosed, setBidClosed] = useState(true);
  const [error, setError] = useState(null);



  const handleDeleteUser = async (participantId) => {
    try {
        console.log(`Deleting participant ID: ${participantId} from bid ID: ${id}`);
        const response = await axios.delete(`http://localhost:3001/bids/${id}/participants`, {
            data: { participantId }, // This should contain the participantId
        });

        if (response.status === 200) {
            toast.success('Participant removed successfully!');
            await fetchBidData(); // Refresh the bid data after deletion
        } else {
            toast.error('Failed to remove participant.');
        }
    } catch (error) {
        console.error('Error removing participant:', error);
        toast.error('Failed to remove participant.');
    }
};


  const fetchBidData = useCallback(async () => {
    try {
      console.log(`Fetching bid data for ID: ${id}`);
      const response = await axios.get(`http://localhost:3001/bids/${id}`);
      console.log('Bid data fetched successfully:', response.data);
      setBidData(response.data);
      const nearest = getNearestBidNo(response.data.Bids);
      setNearestBid(nearest);
      setError(null);
    } catch (error) {
      console.error('Error fetching bid data:', error);
      setError('Failed to fetch bid data.');
      toast.error('Failed to fetch bid data.');
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBidData();
    }
  }, [id, fetchBidData]);

  const handleInputChange = useCallback(async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        console.log(`Searching participants with term: ${value}`);
        const response = await axios.get(`http://localhost:3001/participants?search=${value}`);
        console.log('Search results:', response.data);
        setSearchResults(response.data);
        setError(null);
      } catch (error) {
        console.error('Error searching participants:', error);
        setError('Failed to search participants.');
        toast.error('Failed to search participants.');
      }
    } else {
      setSearchResults([]);
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleAddUser = async (user) => {
    try {
      const { userName, userPhoneNo } = user;
      console.log(`Adding user: ${userName}, Phone: ${userPhoneNo} to bid ID: ${id}`);

      const response = await axios.post(`http://localhost:3001/bids/${id}/add-user`, { userName, userPhoneNo });

      if (response.status === 201) {
        toast.success(response.data.message);
      } else if (response.status === 200) {
        setBidData(response.data);
        setSearchResults([]);
        setSearchTerm('');
        setShowSearch(false);
        toast.success('User added successfully!');
      } else {
        toast.warning('Unexpected response while adding user.');
      }
      setError(null);
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user.');
      toast.error('Failed to add user.');
    }
  };

  const getNearestBidNo = (bids) => {
    const currentDate = new Date();
    let nearestBid = null;
    let nearestDiff = Infinity;

    for (const bid of bids) {
      const bidDate = new Date(bid.BidDate);
      const diff = Math.abs(bidDate - currentDate);
      if (diff < nearestDiff && !bid.BidClose) {
        nearestBid = bid;
        nearestDiff = diff;
      }
    }
    return nearestBid;
  };

  const handleBidStart = async (updatedBid) => {
    try {
      if (!nearestBid || !nearestBid.BidNo) {
        throw new Error('Nearest bid or BidNo is undefined.');
      }
  
      const bidNo = nearestBid.BidNo;
      console.log(`Starting bid No.: ${bidNo} for bid ID: ${bidData._id}`);
  
      const response = await axios.put(
        `http://localhost:3001/bids/${bidData._id}/update-bid/${bidNo}`,
        updatedBid
      );
  
      if (response.status === 200) {
        await fetchBidData();
        toast.success('Bid started successfully!');
      } else {
        toast.error('Failed to start bid');
      }
    } catch (error) {
      console.error('Error starting bid:', error);
      setError('Failed to start bid.');
      toast.error('Failed to start bid.');
    }
  };

  const handleCloseBid = async () => {
    if (!nearestBid) {
      toast.warning('No active bid found.');
      return;
    }
  
    let totalCredit = 0;
    let totalDebit = nearestBid.BidPayOut || 0;
    const unpaidUsers = [];
  
    try {
      for (const user of bidData.users) {
        const bidRound = bidData.Bids.find((b) => b.BidNo === nearestBid.BidNo);
        if (!bidRound) continue;
  
        const paymentStatus = bidRound.PaymentStatus.find((ps) => ps.u_id.toString() === user._id.toString());
        if (paymentStatus && paymentStatus.payed) {
          totalCredit += paymentStatus.payment || 0;
        } else {
          unpaidUsers.push({
            participantId: user.participantId.toString(),
            userName: user.userName,
            userPhoneNo: user.userPhoneNo,
            bidId: bidData._id.toString(),
            user_Id: user._id,
            payment: 0,
            bidNo: nearestBid.BidNo,
            bidDate: nearestBid.BidDate,
          });
        }
      }
  
      if (unpaidUsers.length > 0) {
        await axios.post('http://localhost:3001/payments/update-payment-due', { unpaidUsers });
      }
  
      const closeBidData = {
        totalCredit,
        totalDebit,
        bidId: bidData._id.toString(),
        bidNo: nearestBid.BidNo,
      };
  
      const response = await axios.put(`http://localhost:3001/bids/${bidData._id}/close-bid/${nearestBid.BidNo}`, closeBidData);
      setBidClosed(true);
      await fetchBidData();
      toast.success('Bid closed successfully!');
      setError(null);
    } catch (error) {
      console.error('Error closing bid:', error);
      setError('Failed to close bid.');
      toast.error('Failed to close bid.');
    }
  };

  const isColumnEditable = (index) => {
    return nearestBid && nearestBid.BidNo === index + 1 && nearestBid.BidStart;
  };

  const sortUsersByBidNo = (users) => {
    return users.sort((a, b) => (a.BidWinNo || Infinity) - (b.BidWinNo || Infinity));
  };

  const getPaymentStatus = (userId, bidNo) => {
    const bid = bidData.Bids.find((b) => b.BidNo === bidNo);
    if (bid) {
      const paymentStatus = bid.PaymentStatus.find((status) => status.u_id === userId);
      if (paymentStatus) {
        return {
          payment: paymentStatus.payment || '-',
          payed: paymentStatus.payed || false,
        };
      }
    }
    return {
      payment: '-',
      payed: false,
    };
  };

  const handlePaymentToggle = async (userId) => {
    if (!nearestBid) {
      alert('No active bid found.');
      return;
    }

    try {
      console.log(`Toggling payment status for user ID: ${userId} in bid No.: ${nearestBid.BidNo}`);
      const paymentStatus = nearestBid.PaymentStatus.find((ps) => ps.u_id === userId);
      const currentPayedStatus = paymentStatus ? paymentStatus.payed : false;
      
      await axios.put(`http://localhost:3001/bids/${id}/users/${userId}/payment`, {
        bidNo: nearestBid.BidNo,
        payed: !currentPayedStatus,
      });

      await fetchBidData();
      toast.success('Payment status updated successfully!');
    } catch (error) {
      console.error('Error updating payment status:', error);
      setError('Failed to update payment status.');
      toast.error('Failed to update payment status.');
    }
  };

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!bidData) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const sortedUsers = sortUsersByBidNo(bidData.users);

  return (
    <div className="container">
      {/* Bid Details Section */}
      <div>
        <h3 className="my-4">Bid Details</h3>
        <div className="row">
          {/* Left Column */}
          <div className="col-md-6">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <p><strong>Bid ID:</strong> {bidData._id}</p>
                <p><strong>Amount of Gold:</strong> {bidData.BidSize} gms</p>
                <p><strong>Number of Participants:</strong> {bidData.ParticipantsCount}</p>
                <p><strong>Number of Bids:</strong> {bidData.MonthDuration}</p>
                <p><strong>Start Date:</strong> {formatDate(bidData.StartDate)}</p>
                <p><strong>End Date:</strong> {formatDate(bidData.EndDate)}</p>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="col-md-6">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <p><strong>Bid Round:</strong> {nearestBid ? nearestBid.BidNo : '-'}</p>
                <p><strong>Bid Date:</strong> {nearestBid ? formatDate(nearestBid.BidDate) : '-'}</p>
                <p><strong>Bid Winner:</strong> {nearestBid && nearestBid.BidWinner ? nearestBid.BidWinner.userName : '-'}</p>
                <p><strong>Bid Value:</strong> {nearestBid ? nearestBid.BidValue : '-'}</p>
                <div className="mt-3 d-flex justify-content-end">
                  <button
                    className="btn btn-success me-3"
                    onClick={() => setShowBidModal(true)}
                    disabled={nearestBid && nearestBid.BidStart}
                  >
                    Start Bid
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={!nearestBid || nearestBid.BidClose}
                    onClick={handleCloseBid}
                  >
                    Close Bid
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Table */}
      <div className="mt-4">
        <h5>Participants:</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Sl. No</th>
                <th>User</th>
                <th>Bid No</th>
                <th>Bid (Value)</th>
                <th>P/O</th>
                {[...Array(bidData.MonthDuration)].map((_, index) => (
                  <th
                    key={index + 1}
                    style={{
                      backgroundColor: isColumnEditable(index) ? '#28a745' : '#007bff',
                      color: 'white',
                    }}
                  >
                    {index + 1}
                  </th>
                ))}
                <th>Paid</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
  {sortedUsers.length > 0 ? (
    sortedUsers.map((user, index) => {
      const paymentInfo = nearestBid ? getPaymentStatus(user._id, nearestBid.BidNo) : { payment: '-', payed: false };
      return (
        <tr key={user._id}>
          <td>{index + 1}</td>
          <td>{user.userName}</td>
          <td>{user.BidWinNo || '-'}</td>
          <td>{user.BidValue || '-'}</td>
          <td>{user.BidPayOut || '-'}</td>
          {[...Array(bidData.MonthDuration)].map((_, monthIndex) => (
            <td key={monthIndex + 1}>
              {bidData.Bids[monthIndex] && bidData.Bids[monthIndex].PaymentStatus.find(status => status.u_id === user._id)?.payment || '-'}
            </td>
          ))}
          <td>
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={paymentInfo.payed}
                onChange={() => handlePaymentToggle(user._id)}
                disabled={!nearestBid || nearestBid.BidClose}
                id={`payment-checkbox-${user._id}`}
              />
              <label htmlFor={`payment-checkbox-${user._id}`} className="form-check-label">
                {paymentInfo.payed ? 'Paid' : 'Unpaid'}
              </label>
            </div>
          </td>
          {/* Delete User Button */}
          <td>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDeleteUser(user.participantId)}
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
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
      </div>

      {/* Search and Add User */}
      <button className="btn btn-primary mt-4" onClick={() => setShowSearch(!showSearch)}>
        {showSearch ? "Hide Search" : "Add User"}
      </button>

      {showSearch && (
        <div className="mt-4">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or phone number"
              value={searchTerm}
              onChange={handleInputChange}
            />
          </div>

          {searchResults.length > 0 && (
            <ul className="list-group">
              {searchResults.map((user) => (
                <li
                  key={user._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {user.userName} - {user.userPhoneNo}
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleAddUser(user)}
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Bid Management Account */}
      <div className="mt-4">
        <h5>Bid Management Account:</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Sl. No</th>
                <th>Account</th>
                {[...Array(bidData.MonthDuration)].map((_, index) => (
                  <th key={index + 1}>{index + 1}</th>
                ))}
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Management Credit</td>
                {bidData.BidManagementAccount.map((account, index) => (
                  <td key={index}>{account.ManagementCredit}</td>
                ))}
                <td>
                  {bidData.BidManagementAccount.reduce((total, account) => total + account.ManagementCredit, 0)}
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Management Debit</td>
                {bidData.BidManagementAccount.map((account, index) => (
                  <td key={index}>{account.ManagementDebit}</td>
                ))}
                <td>
                  {bidData.BidManagementAccount.reduce((total, account) => total + account.ManagementDebit, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bid Modal */}
      <BidModal
        show={showBidModal}
        onClose={() => setShowBidModal(false)}
        bidData={bidData}
        nearestBid={nearestBid}
        onBidStart={handleBidStart}
      />

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default BidPage;