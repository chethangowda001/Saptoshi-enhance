// controller/profitController.js
const Bids = require('../models/Bids');

exports.getProfitData = async (req, res) => {
  try {
    const { bidId } = req.params;

    const bid = await Bids.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const bidSize = bid.BidSize || 0;
    const monthDuration = bid.MonthDuration || 0;
    const bidPayOut = bid.Bids.reduce((total, b) => total + (b.BidPayOut || 0), 0);
    const totalManagementDebit = bid.BidManagementAccount.reduce((total, acc) => total + (acc.ManagementDebit || 0), 0);
    
    const totalRevenue = bidSize * monthDuration;
    const totalExpenses = bidPayOut + totalManagementDebit;
    const profit = totalRevenue - totalExpenses;

    // Send detailed data for the frontend to visualize
    res.status(200).json({
      totalRevenue,
      totalExpenses,
      profit,
      bidPayOut,
      totalManagementDebit,
      bidSize,
      monthDuration
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
