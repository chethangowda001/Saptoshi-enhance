import React, { useEffect, useState } from 'react';

import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';import { useNavigate, useParams } from 'react-router-dom';

const getBase64Image = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
      reject(error);
    };
    img.src = url;
  });
};

const ParticipantDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [participant, setParticipant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/participants/${id}`);
        setParticipant(response.data.data);
      } catch (err) {
        console.error('Error fetching participant details:', err);
        setError('Failed to fetch participant details');
      }
    };

    fetchParticipantDetails();
  }, [id]);

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    doc.text('Participant Details', 14, 16);
    doc.text(`Name: ${participant.userName}`, 14, 30);
    doc.text(`Email: ${participant.userEmail}`, 14, 40);
    doc.text(`Phone No: ${participant.userPhoneNo}`, 14, 50);
    doc.text(`Address: ${participant.address}`, 14, 60);
    doc.text(`Aadhar No: ${participant.aadharNo}`, 14, 70);
    doc.text(`PAN No: ${participant.panNo}`, 14, 80);
    doc.text(`Created At: ${new Date(participant.createdAt).toLocaleDateString()}`, 14, 90);

    if (participant.profileImageURL) {
      try {
        const imageBase64 = await getBase64Image(`http://localhost:3001${participant.profileImageURL}`);
        doc.addImage(imageBase64, 'PNG', 14, 100, 50, 50);
      } catch (error) {
        console.error('Error converting image to base64:', error);
      }
    }

    doc.save('participant-details.pdf');
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!participant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="card">
        <div className="card-header">
          <h2>Participant Details</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3">
              {participant.profileImageURL ? (
                <img
                  src={`http://localhost:3001${participant.profileImageURL}`}
                  alt={`${participant.userName}'s profile`}
                  width="300"
                  height="500"
                />
              ) : (
                'No image'
              )}
            </div>
            <div className="col-md-9">
              <h4>{participant.userName}</h4>
              <p><strong>Email:</strong> {participant.userEmail}</p>
              <p><strong>Phone No:</strong> {participant.userPhoneNo}</p>
              <p><strong>Address:</strong> {participant.address}</p>
              <p><strong>Aadhar No:</strong> {participant.aadharNo}</p>
              <p><strong>PAN No:</strong> {participant.panNo}</p>
              <p><strong>Document:</strong> 
                {participant.document ? (
                  <a href={participant.document} target="_blank" rel="noopener noreferrer">View Document</a>
                ) : (
                  'No Document'
                )}
              </p>
              <p><strong>Created At:</strong> {new Date(participant.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="d-flex justify-content-between">
  {/* Navigate back to Registered Users */}
  <button className="btn btn-primary" onClick={() => navigate('/dashboard/registeredusers')}>
    Back
  </button>

  {/* Download PDF button */}
  <button className="btn btn-secondary" onClick={downloadPDF}>
    Download as PDF
  </button>

  {/* Navigate to Participant Details with Bids */}
  <button className="btn btn-info" onClick={() => navigate(`/participants/${id}/bids`)}>
    View Complete Details with Bids
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default ParticipantDetails;
