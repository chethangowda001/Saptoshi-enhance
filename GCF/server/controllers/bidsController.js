const Bids = require('../models/Bids');
const Participant = require('../models/Participants');
const Payment = require('../models/PaymentDue');
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

exports.addBid = async (req, res) => {
  const { StartDate, MonthDuration, BidSize, AD } = req.body;
  try {
    const startDate = new Date(StartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + parseInt(MonthDuration));

    const newBid = new Bids({
      StartDate: startDate,
      EndDate: endDate,
      MonthDuration,
      ParticipantsCount: 0,
      BidSize,
      AD,
      users: [],
      Bids: Array.from({ length: MonthDuration }, (_, index) => {
        const bidDate = new Date(startDate);
        bidDate.setMonth(bidDate.getMonth() + index);

        return {
          BidNo: index + 1,
          BidWinner: { userName: '', phoneNumber: '' },
          BidValue: 0,
          BidDate: bidDate,
          BidStake: 0,
          PaymentStatus: [],
        };
      }),
      BidManagementAccount: Array.from({ length: MonthDuration }, (_, index) => ({
        BidNo: index + 1,
        ManagementCredit: 0,
        ManagementDebit: 0,
      }))
    });

    const bid = await newBid.save();
    res.json(bid);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getOngoingBids = async (req, res) => {
  try {
    const currentDate = new Date();
    const ongoingBids = await Bids.find({ EndDate: { $gte: currentDate } });
    res.json(ongoingBids);
  } catch (err) {
    console.error('Error fetching ongoing bids:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getArchivedBids = async (req, res) => {
  try {
    const currentDate = new Date();
    const archivedBids = await Bids.find({ EndDate: { $lt: currentDate } });
    res.json(archivedBids);
  } catch (err) {
    console.error('Error fetching archived bids:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBidById = async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await Bids.findById(id);
    if (!bid) {
      return res.status(404).json({ msg: 'Bid not found' });
    }
    res.json(bid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addUserToBid = async (req, res) => {
  const { id } = req.params;
  const { userName, userPhoneNo } = req.body;

  try {
    const bid = await Bids.findById(id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    bid.users = bid.users || [];

    const participant = await Participant.findOne({ userName, userPhoneNo });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    const existingUser = bid.users.find(user => user.participantId.equals(participant._id));
    if (existingUser) {
      return res.status(201).json({ message: 'User already added to this bid.' });
    }

    bid.users.push({
      participantId: participant._id,
      userName: participant.userName,
      userPhoneNo: participant.userPhoneNo,
      StartDate: new Date(),
      BidWinNo: 0,
      BidValue: 0,
      BidPayOut: 0
    });
    bid.ParticipantsCount += 1;

    await bid.save();
    res.json(bid);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBid = async (req, res) => {
  const { id } = req.params;
  const updatedBid = req.body;

  try {
    const bid = await Bids.findByIdAndUpdate(id, updatedBid, { new: true });
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    res.json(bid);
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBidDetails = async (req, res) => {
  const { bidId, bidNo } = req.params;
  const { BidWinner, BidValue, BidStake, PaymentStatus, BidStart, BidPayOut } = req.body;

  try {
    const bid = await Bids.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const bidRound = bid.Bids.find(b => b.BidNo === parseInt(bidNo));
    if (!bidRound) {
      return res.status(404).json({ message: 'Bid round not found' });
    }

    bidRound.BidWinner = BidWinner;
    bidRound.BidValue = BidValue;
    bidRound.BidStake = BidStake;
    bidRound.PaymentStatus = PaymentStatus;
    bidRound.BidStart = BidStart;
    bidRound.BidPayOut = BidPayOut;

    await bid.save();
    res.status(200).json({ message: 'Bid updated successfully', bid: bidRound });
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUsersInBid = async (req, res) => {
  const { bidId } = req.params;
  const { users } = req.body;

  try {
    const bid = await Bids.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    bid.users = users;
    await bid.save();
    res.status(200).json({ message: 'Users updated successfully', bid });
  } catch (error) {
    console.error('Error updating users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserInBid = async (req, res) => {
  const { bidId, userId } = req.params;
  const updateData = req.body;

  try {
    const bid = await Bids.findOneAndUpdate(
      { _id: bidId, "users._id": userId },
      {
        $set: {
          "users.$.BidWinNo": updateData.BidWinNo,
          "users.$.BidValue": updateData.BidValue,
          "users.$.BidPayOut": updateData.BidPayOut,
        }
      },
      { new: true }
    );

    if (!bid) {
      return res.status(404).send({ message: 'Bid or user not found' });
    }

    res.send(bid);
  } catch (error) {
    console.error('Error updating user in bid:', error);
    res.status(500).send({ message: 'Failed to update user in bid', error });
  }
};

exports.closeBid = async (req, res) => {
  const { bidId, bidNo } = req.params;
  const { totalCredit, totalDebit } = req.body;

  try {
    const updatedBid = await Bids.findOneAndUpdate(
      { _id: bidId, 'BidManagementAccount.BidNo': bidNo },
      {
        $set: {
          'BidManagementAccount.$.ManagementCredit': totalCredit,
          'BidManagementAccount.$.ManagementDebit': totalDebit,
          'Bids.$.BidClose': true
        }
      },
      { new: true }
    );

    if (!updatedBid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.status(200).json({ message: 'Bid closed successfully', updatedBid });
  } catch (error) {
    console.error('Error closing bid:', error);
    res.status(500).json({ error: 'Failed to close bid' });
  }
};



exports.updatePaymentStatus = async function(req, res) {
  const { bidId, userId } = req.params;
  const { bidNo, payed } = req.body;
  try {
    const bid = await Bids.findOneAndUpdate(
      { 
        _id: bidId, 
        "Bids.BidNo": bidNo,
        "Bids.PaymentStatus.u_id": userId 
      },
      { 
        $set: { "Bids.$[bid].PaymentStatus.$[user].payed": payed } 
      },
      { 
        new: true, 
        arrayFilters: [
          { "bid.BidNo": bidNo },
          { "user.u_id": userId }
        ]
      }
    );
    if (!bid) {
      return res.status(404).send({ message: "Bid or user not found" });
    }
    res.status(200).send(bid);
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
};

exports.paymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    // Fetch the bid using the bidId, populating the 'users.participantId' field
    const bid = await Bids.findById(id).populate('users');

    if (!bid) {
      return res.status(404).json({ message: "Bid not found", success: false });
    }

    // Map over the Bids array
    const paymentStatus = bid.Bids.map(bidRecord => {
      return {
        BidNo: bidRecord.BidNo,
        BidWinner: bidRecord.BidWinner.userName || "Unknown",
        BidWinnerPhone: bidRecord.BidWinner.phoneNumber || "Unknown",
        PaymentStatus: bidRecord.PaymentStatus.map(paymentRecord => ({
          userName: paymentRecord.u_id ? paymentRecord.u_id.userName : 'Unknown',
          userPhoneNo: paymentRecord.u_id ? paymentRecord.u_id.userPhoneNo : 'Unknown',
          payment: paymentRecord.payment !== undefined ? paymentRecord.payment : 'No Payment Data',
          payed: paymentRecord.payed !== undefined 
                ? (paymentRecord.payed === true ? 'Paid' : 'Not Paid') 
                : 'Payment Status Unknown'
        }))
      };
    });

    // Flatten the array in case of multiple payment records per bid
    const flattenedPaymentStatus = paymentStatus.flat();
    

    return res.status(200).json({ 
      message: "Payment status fetched successfully", 
      success: true, 
      data: flattenedPaymentStatus 
    });
  } catch (error) {
    console.error("Error in paymentStatus function:", error);
    return res.status(500).json({ message: "Internal server error", success: false, error });
  }
};






exports.archiveSummary = async (req, res) => {
  try {
    const { id } = req.params; // Extract ID from URL parameters

    console.log(`Received request to fetch bid with ID: ${id}`);

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid ObjectId format.');
      return res.status(400).json({ message: 'Invalid Bid ID format.' });
    }

    // Fetch the bid by ID with necessary populates
    const bidSummary = await Bids.findById(id)
      .populate('users.participantId') // Populate participant details
      .populate({
        path: 'Bids.PaymentStatus.u_id',
        select: 'userName userPhoneNo', // Select specific fields
        model: 'User', // Ensure this matches your User model name
      })
      .exec();

    if (!bidSummary) {
      console.log('Bid not found.');
      return res.status(404).json({ message: 'Bid not found.' });
    }

    console.log('Bid fetched successfully:', bidSummary);
    res.json(bidSummary);
  } catch (error) {
    console.error('Error fetching bid summary:', error);
    res.status(500).json({ message: 'Error fetching bid summary.' });
  }
};


exports.getProfit = async (req, res) => {
  try {
    const bids = await Bids.find()
      .populate('users.participantId')
      .populate('Bids.PaymentStatus.u_id');
      
    // The virtual 'profit' should now be included in each bid
    res.status(200).json({ success: true, data: bids });
  } catch (error) {
    console.error('Error fetching bids:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};







// API to update payment status and delete the payment due entry
exports.updatePaymentStatusAndRemoveDue = async function(req, res) {
  const { bidId, userId } = req.params; // userId corresponds to user_Id in Payment schema
  const { bidNo, payed } = req.body;    // Get bid number and payment status (true/false)

  try {
   
    const bid = await Bids.findOneAndUpdate(
      { 
        _id: bidId, 
        "Bids.BidNo": bidNo,
        "Bids.PaymentStatus.u_id": userId 
      },
      { 
        $set: { "Bids.$[bid].PaymentStatus.$[user].payed": payed } 
      },
      { 
        new: true, 
        arrayFilters: [
          { "bid.BidNo": bidNo },    // Ensure correct bid number
          { "user.u_id": userId }     // Ensure correct user ID
        ]
      }
    );

    // If bid or user is not found, return 404
    if (!bid) {
      return res.status(404).send({ message: "Bid or user not found" });
    }

    // Delete the corresponding entry in the Payment model for the user
    const paymentDeleted = await Payment.findOneAndDelete({
      user_Id: userId,  // Find by user_Id in Payment model
      bidId: bidId      // Ensure it's the correct bid
    });

    // If the payment due entry was not found, return 404
    if (!paymentDeleted) {
      return res.status(404).send({ message: "Payment due entry not found" });
    }

    // Return the updated bid information after payment status change and payment due deletion
    res.status(200).send({ message: "Payment status updated and payment due entry removed", bid });

  } catch (error) {
    // Handle internal errors
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
};




// controllers/bidsController.js

// const Bids = require('../models/Bids'); // Adjust the path as necessary
// const Payment = require('../models/Payment'); // Model name is 'Payment'

// exports.markUserAsPaid = async (req, res) => {
//   const { participantId, bidId, bidNo } = req.body;
//   console.log("requested data", req.body);
  
//   // Validate required fields
//   if (!participantId || !bidId || !bidNo) {
//     return res.status(400).json({ message: 'participantId, bidId, and bidNo are required' });
//   }

//   try {
//     // Step 1: Remove the corresponding PaymentDue document
//     const deletedPayment = await Payment.deleteOne({
//       userId: participantId,
//       bidId: bidId,
//       bidNo: bidNo,
//     });
//     console.log("deletedPayment data", deletedPayment);

//     if (deletedPayment.deletedCount === 0) {
//       return res.status(404).json({ message: 'Payment due record not found' });
//     }

//     // Step 2: Update the Bids schema's PaymentStatus to set 'payed' to true
//     const updateResult = await Bids.findOneAndUpdate(
//       { 
//         _id: bidId, 
//         "Bids.BidNo": bidNo,
//         "Bids.PaymentStatus.u_id": participantId 
//       },
//       { 
//         $set: { "Bids.$[bid].PaymentStatus.$[user].payed": true } 
//       },
//       { 
//         new: true, 
//         arrayFilters: [
//           { "bid.BidNo": bidNo },
//           { "user.u_id": participantId }
//         ]
//       }
//     );

//     if (!updateResult) {
//       return res.status(404).json({ message: 'Bid or PaymentStatus not found for the user' });
//     }

//     res.status(200).json({ message: 'User payment updated successfully' });

//   } catch (error) {
//     console.error('Error marking user as paid:', error);
//     res.status(500).json({ message: 'Failed to mark user as paid' });
//   }
// };





exports.removeParticipants = async (req, res) => {
  const { id } = req.params; // Bid ID
  const { participantId } = req.body; // Participant ID passed in the request body
  
  try {
    // Check if participantId is provided
    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    // Check if the provided participantId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({ error: 'Invalid participant ID format' });
    }

    // Find the bid by its ID and remove the participant from the `users` array
    const bid = await Bids.findByIdAndUpdate(
      id,
      {
        $pull: {
          users: { participantId: new mongoose.Types.ObjectId(participantId) }, // Use `new` when creating ObjectId
        },
        $inc: { ParticipantsCount: -1 }, // Decrease the participants count
      },
      { new: true } // Return the updated document
    );

    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Success response
    res.status(200).json({ message: 'Participant removed successfully', bid });
  } catch (error) {
    console.error('Error removing participant:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getBidProfit = async (req, res) => {
  const { bidId } = req.params;

  try {
    // Find the bid by its ID
    const bid = await Bids.findById(bidId);

    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    // Calculate the profit using the virtual field
    const profit = bid.profit;

    // Send the profit as the response
    res.status(200).json({ profit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllBid = async (req, res) => {
  try {
    const bids = await Bids.find();
    res.status(200).json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);  // Logs the actual error in the server logs for debugging
    res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};
