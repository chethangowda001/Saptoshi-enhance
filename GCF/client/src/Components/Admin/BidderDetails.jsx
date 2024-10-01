import React from 'react';
import { useParams } from 'react-router-dom';
import "../../css/BidderDetails.css"
const BidderDetails = () => {
    const { bidId } = useParams();

    // Assuming you have a data structure or API call to fetch details based on bidId
    const bidderDetails = {
        bidId: bidId,
        name: 'Aditya',
        status: 'Active',
        contact: '123-456-7890',
        aadharNo: '1234-5678-9012',
        pan: 'ABCDE1234F',
        modeOfPayment: 'Online',
        // Add more details as needed
    };
    const ongoingBidsData = [
        { bidNo: 'BID001', start: '01/01/2023', end: '15/01/2023', bidSize: '$10,000', ad: 'Regular Auction' },
        // Add more ongoing bids data as needed
      ];
    
    return (
        <div className="bidder-details-container">
            <h3>Bidder Details for BID-Id: {bidId}</h3>
            <div className="details">
                <div className="container">
                    <div>
                        <strong>Name:</strong> {bidderDetails.name}
                    </div>
                    <div>
                        <strong>Status:</strong> {bidderDetails.status}
                    </div>
                    <div>
                        <strong>Contact:</strong> {bidderDetails.contact}
                    </div>
                    <div>
                        <strong>Aadhar No.:</strong> {bidderDetails.aadharNo}
                    </div>
                    <div>
                        <strong>PAN:</strong> {bidderDetails.pan}
                    </div>
                    <div>
                        <strong>Mode of Payment:</strong> {bidderDetails.modeOfPayment}
                    </div>
                </div>
            
                <div className="container">
                    <strong>Photo</strong>
                    <div id="photo">

                    </div>
                    <strong> Documents Uploaded</strong>
                    <div id="documents">
                        <ol>
                            <li>Aadhaar</li>
                            <li>PAN</li>
                        </ol>
                        <div className="button btn btn-sm btn-success">Download</div>
                    </div>
                </div>
            </div>
                
            <div className="ongoing-bids-container">
        <h3>Ongoing Bids</h3>
        <table className="ongoing-bids-table">
          <thead>
            <tr>
              <th>Bid No.</th>
              <th>Start</th>
              <th>End</th>
              <th>Bid Size</th>
              <th>Ad</th>
            </tr>
          </thead>
          <tbody>
            {ongoingBidsData.map((bid) => (
              <tr key={bid.bidNo}>
                <td>{bid.bidNo}</td>
                <td>{bid.start}</td>
                <td>{bid.end}</td>
                <td>{bid.bidSize}</td>
                <td>{bid.ad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            {/* Add more details as needed */}
        </div>
    );
};

export default BidderDetails;
