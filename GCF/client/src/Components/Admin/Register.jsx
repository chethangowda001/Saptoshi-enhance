import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../css/Register.css"; // Assuming your CSS is linked here

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    status: '',
    contact: '',
    aadharNo: '',
    pan: '',
    photo: null,
    document: null,
  });

  const [bidId, setBidId] = useState('');
  const [registeredParticipants, setRegisteredParticipants] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'photo' || name === 'document' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const generatedBidId = `BID-${Date.now()}`;

    setRegisteredParticipants((prevParticipants) => [
      ...prevParticipants,
      { bidId: generatedBidId, name: formData.name },
    ]);

    setFormData({
      name: '',
      status: '',
      contact: '',
      aadharNo: '',
      pan: '',
      photo: null,
      document: null,
    });

    setBidId(generatedBidId);

    toast.success('Participant registered successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  };

  const handleBidIdClick = (bidId) => {
    console.log(`Clicked on BID-Id: ${bidId}`);
  };

  return (
    <div className="register-participant-container">
      <h2 className="form-title text-center mb-4">Register Participant</h2>

      <form id="reg-ip" onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            placeholder="Enter status"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Aadhar No.</label>
          <input
            type="text"
            name="aadharNo"
            value={formData.aadharNo}
            onChange={handleChange}
            placeholder="Enter Aadhar number"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>PAN</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleChange}
            placeholder="Enter PAN number"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Photo upload</label>
          <input type="file" name="photo" onChange={handleChange} className="form-control" />
        </div>

        <div className="form-group">
          <label>Document upload</label>
          <input type="file" name="document" onChange={handleChange} className="form-control" />
        </div>

        <button type="submit" className="btn btn-primary btn-block mt-3">
          Submit
        </button>
      </form>

      {bidId && (
        <div className="alert alert-success mt-4">
          Registered successfully with BID-Id: {bidId}
        </div>
      )}

      <h3 className="mt-5">Registered Participants</h3>
      <table className="registered-participants-table table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>BID-Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {registeredParticipants.map((participant) => (
            <tr key={participant.bidId} onClick={() => handleBidIdClick(participant.bidId)}>
              <td>
                <Link to={`/bidder-details/${participant.bidId}`} className="bid-link">
                  {participant.bidId}
                </Link>
              </td>
              <td>{participant.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="btn btn-outline-info btn-block mt-5"
        onClick={() => navigate('/registeredUsers')}
      >
        Go to Registered Users
      </button>

      <ToastContainer />
    </div>
  );
};

export default Register;
