import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentDueUsers = () => {
  const [paymentDueUsers, setPaymentDueUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(false);

  useEffect(() => {
    // Fetch payment due users from the backend API
    const fetchPaymentDueUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/payments/get-payment-due-users');
        setPaymentDueUsers(response.data.data); // Adjust based on actual response structure
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchPaymentDueUsers();
  }, []);

  // Function to handle marking a user as paid
  const handleMarkAsPaid = async (user) => {
    setMarkingPaid(true);
    try {
      // Make a PUT request to mark the user as paid
      const response = await axios.put(
        `http://localhost:3001/bids/${user.bidId}/payment-status/${user.user_Id}`, // Adjusted API route
        { 
          bidNo: user.bidNo, // Send the bid number in the body
          payed: true // Set the payed status to true
        }
      );

      // Show a success message when the API call succeeds
      toast.success(`${user.useerName}'s payment marked as paid!`);

      // Remove the paid user from the list
      setPaymentDueUsers((prevUsers) => prevUsers.filter(u => u.user_Id !== user.user_Id));

    } catch (error) {
      // Show an error message if the API call fails
      toast.error(error.response?.data?.message || 'Failed to mark as paid');
    } finally {
      setMarkingPaid(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading Payment Due Users...</p>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger text-center">Error: {error}</div>;
  }

  return (
    <div className="container my-5">
      <ToastContainer /> {/* Include ToastContainer for notifications */}

      <h2 className="mb-4 text-center">Users with Payment Due</h2>
      {paymentDueUsers.length === 0 ? (
        <div className="alert alert-info text-center">No users with payment due.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>User Name</th>
                <th>Phone Number</th>
                <th>Bid Number</th>
                <th>Bid Date</th>
                <th>Payment Due ($)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paymentDueUsers.map((user) => (
                <tr key={`${user.userId}-${user.bidId}-${user.bidNo}`}>
                  <td>{user.useerName}</td> {/* Adjusted typo */}
                  <td>{user.userPhoneNo}</td>
                  <td>{user.bidNo}</td>
                  <td>{new Date(user.bidDate).toLocaleDateString()}</td>
                  <td>{user.payementDue ? user.payementDue.toFixed(2) : '0.00'}</td> {/* Safeguard */}
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleMarkAsPaid(user)}
                      disabled={markingPaid}
                    >
                      {markingPaid ? 'Processing...' : 'Mark as Paid'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentDueUsers;
