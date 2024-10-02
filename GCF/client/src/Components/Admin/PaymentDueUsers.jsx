import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentDueUsers = () => {
  const [paymentDueUsers, setPaymentDueUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch payment due users from the backend API
    const fetchPaymentDueUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/payments/get-payment-due-users');
        setPaymentDueUsers(response.data.data); // Assuming the data is in response.data.data
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPaymentDueUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // You can style this or replace with a spinner
  }

  if (error) {
    return <div>Error: {error}</div>; // Display any error message
  }

  return (
    <div className="container">
      <h2>Users with Payment Due</h2>
      {paymentDueUsers.length === 0 ? (
        <p>No users with payment due.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Phone Number</th>
              <th>Bid Number</th>
              <th>Bid Date</th>
              <th>Payment Due</th>
            </tr>
          </thead>
          <tbody>
            {paymentDueUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.useerName}</td>
                <td>{user.userPhoneNo}</td>
                <td>{user.bidNo}</td>
                <td>{new Date(user.bidDate).toLocaleDateString()}</td> {/* Format the date */}
                <td>{user.payementDue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentDueUsers;
