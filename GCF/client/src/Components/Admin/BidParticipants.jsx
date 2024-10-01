import React from 'react';
import "../../css/BidParticipants.css"
const BidParticipants = () => {
  const participantsData = [
    {
      slNo: 1,
      name: 'Aditya',
      bidId: 'BID001',
      phoneNo: '123-456-7890',
      addDetails: 'Lorem ipsum dolor sit amet',
      dues: '$500',
      active: true,
      prev: false,
    },
    // Add more participant data as needed
  ];

  const activeParticipants = participantsData.filter((participant) => participant.active);
  const inactiveParticipants = participantsData.filter((participant) => !participant.active);

  return (
    <div className="bid-participants-container">
      <h3>Bid Participants</h3>

      <div className="table-container">
        <table className="participants-table">
          <thead>
            <tr>
              <th>Sl. No</th>
              <th>Name</th>
              <th>Bid-Id</th>
              <th>Phone No</th>
              <th>Add Details</th>
              <th>Dues</th>
              <th>Active</th>
              <th>Prev</th>
            </tr>
          </thead>
          <tbody>
            {participantsData.map((participant) => (
              <tr key={participant.bidId}>
                <td>{participant.slNo}</td>
                <td>{participant.name}</td>
                <td>{participant.bidId}</td>
                <td>{participant.phoneNo}</td>
                <td>{participant.addDetails}</td>
                <td>{participant.dues}</td>
                <td>{participant.active ? 'Yes' : 'No'}</td>
                <td>{participant.prev ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary-table">
        <table className="summary-part">
          <tbody>
            <tr>
              <td>Total Registered Participants:</td>
              <td>{participantsData.length}</td>
            </tr>
            <tr>
              <td>Active Participants:</td>
              <td>{activeParticipants.length}</td>
            </tr>
            <tr>
              <td>Inactive Participants:</td>
              <td>{inactiveParticipants.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BidParticipants;
