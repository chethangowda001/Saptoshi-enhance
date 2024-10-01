const PaymentDue = require('../models/PaymentDue');

exports.updatePaymentDue = async (req, res) => {
  const { participantId, userName, userPhone, bidId, payment, bidNo, bidDate } = req.body;
  try {
    const paymentDue = await PaymentDue.create({
      participantId,
      userName,
      userPhone,
      bidId,
      payment,
      bidNo,
      bidDate,
    });
    res.status(200).json({ message: 'Payment due updated successfully', paymentDue });
  } catch (error) {
    console.error('Error updating payment due:', error);
    res.status(500).json({ error: 'Failed to update payment due' });
  }
};
