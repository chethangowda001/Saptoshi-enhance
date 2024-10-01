import React from 'react';
import "../../css/ProfitLoss.css"; // Import the corresponding CSS file

const ProfitLoss = () => {
  const profitLossData = [
    { slNo: 1, bidNo: 'BID001', start: '01/01/2023', end: '15/01/2023', netProfit: '$2,000', additionalDetails: 'Successful Auction' },
    // Add more profit/loss data as needed
  ];

  // Calculate total completed bids and net profit
  const totalCompletedBids = profitLossData.length;
  const netProfit = profitLossData.reduce((total, bid) => total + parseFloat(bid.netProfit.replace('$', '').replace(',', '')), 0);

  return (
    <div className="profit-loss-container">
      <h3>Profit/Loss Details</h3>
      <table className="profit-loss-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Bid No.</th>
            <th>Start</th>
            <th>End</th>
            <th>Net Profit</th>
            <th>Additional Details</th>
          </tr>
        </thead>
        <tbody>
          {profitLossData.map((bid) => (
            <tr key={bid.bidNo}>
              <td>{bid.slNo}</td>
              <td>{bid.bidNo}</td>
              <td>{bid.start}</td>
              <td>{bid.end}</td>
              <td>{bid.netProfit}</td>
              <td>{bid.additionalDetails}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Additional Summary Information */}
      <div className="summary">
        <strong>Total Completed Bids:</strong> {totalCompletedBids}
        <br />
        <strong>Net Profit:</strong> ${netProfit.toLocaleString()}
      </div>
    </div>
  );
};

export default ProfitLoss;
