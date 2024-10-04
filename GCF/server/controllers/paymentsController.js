

// exports.updatePaymentDue = async (req, res) => {
//   const { participantId, userName, userPhone, bidId, payment, bidNo, bidDate } = req.body;
//   try {
//     const paymentDue = await PaymentDue.create({
//       participantId,
//       userName,
//       userPhone,
//       bidId,
//       payment,
//       bidNo,
//       bidDate,
//     });
//     res.status(200).json({ message: 'Payment due updated successfully', paymentDue });
//   } catch (error) {
//     console.error('Error updating payment due:', error);
//     res.status(500).json({ error: 'Failed to update payment due' });
//   }
// };

// controllers/bidsController.js

const Bids = require('../models/Bids'); // Adjust the path as necessary
const PaymentDue = require('../models/PaymentDue');


// Existing controller functions...

exports.updatePaymentDue = async (req, res) => {
  const { unpaidUsers } = req.body;

  if (!unpaidUsers || !Array.isArray(unpaidUsers) || unpaidUsers.length === 0) {
    return res.status(400).json({ message: 'No unpaid users provided for payment due update' });
  }

  try {
    const paymentPromises = unpaidUsers.map(async (user) => {
      const { participantId, userName, userPhoneNo, bidId, bidNo, bidDate, payment , user_Id} = user;

      // Validate required fields
      if (!participantId || !userName || !userPhoneNo || !bidId || !bidNo || !bidDate) {
        console.warn(`Missing required fields for user: ${userName}`);
        return null; // Skip this user
      }

      // Create a new Payment document
      const newPayment = new PaymentDue({
        userId: participantId,
        user_Id: user_Id,
        useerName: userName,
        userPhoneNo: userPhoneNo,
        bidId: bidId,
        payementDue: payment,
        bidNo: bidNo,
        bidDate: bidDate,
      });

      return newPayment.save();
    });

    // Wait for all payment documents to be saved
    const savedPayments = await Promise.all(paymentPromises);

    // Filter out any null results (users with missing fields)
    const successfulPayments = savedPayments.filter(payment => payment !== null);

    res.status(200).json({ message: 'Payment dues updated successfully', payments: successfulPayments });
  } catch (error) {
    console.error('Error updating payment dues:', error);
    res.status(500).json({ message: 'Failed to update payment dues' });
  }
};



exports.getPayemntDueUsers = async(req, res)=>{
    try {
      const user = await PaymentDue.find();
      if(!user){
        return res.status(404).json({message:" no users", })
      }
      res.status(200).json({data : user, message: "success"})
    } catch (error) {
      res.status(500).json({message: "internal server error", error: error.message})
    }

  
}
