import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
import "../../css/Register.css";

const Register = () => {
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

    // Generate a unique BID-Id (simple example for illustration)
    const generatedBidId = `BID-${Date.now()}`;

    // Save the participant details and BID-Id
    setRegisteredParticipants((prevParticipants) => [
      ...prevParticipants,
      { bidId: generatedBidId, name: formData.name },
    ]);

    // Clear the form data
    setFormData({
      name: '',
      status: '',
      contact: '',
      aadharNo: '',
      pan: '',
      photo: null,
      document: null,
    });

    // Set the generated BID-Id for display
    setBidId(generatedBidId);

    // Show success toast
    toast.success('Participant registered successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 5000,
    });
  };

  const handleBidIdClick = (bidId) => {
    // Handle the click on BID-Id to show details
    console.log(`Clicked on BID-Id: ${bidId}`);
    // Here, you can implement the logic to display details in a separate div
  };

  return (
    <div className="register-participant-container">
      <h3>Register Participant</h3>
      <form id="reg-ip" onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>
          Status:
          <input type="text" name="status" value={formData.status} onChange={handleChange} />
        </label>
        <label>
          Contact:
          <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
        </label>
        <label>
          Aadhar No.:
          <input type="text" name="aadharNo" value={formData.aadharNo} onChange={handleChange} />
        </label>
        <label>
          PAN:
          <input type="text" name="pan" value={formData.pan} onChange={handleChange} />
        </label>
        <label>
          Photo upload:
          <input type="file" name="photo" onChange={handleChange} />
        </label>
        <label>
          Document upload:
          <input type="file" name="document" onChange={handleChange} />
        </label>
        <button type="submit">Submit</button>
      </form>

      <h3>Registered Participants</h3>
      <table className="registered-participants-table">
        <thead>
          <tr>
            <th>BID-Id</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {registeredParticipants.map((participant) => (
            <tr key={participant.bidId} onClick={() => handleBidIdClick(participant.bidId)}>
              <td>
                <Link to={`/bidder-details/${participant.bidId}`}>{participant.bidId}</Link>
              </td>
              <td>{participant.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Toast container for displaying toasts */}
      <ToastContainer />
    </div>
  );
};

export default Register;
