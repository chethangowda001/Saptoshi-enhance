// models/Payment.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentDueSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Participant' }, // Assuming 'Participant' is the correct ref
    useerName: String,
    userPhoneNo: String,
    bidId: { type: Schema.Types.ObjectId, ref: 'Bids' }, // Reference to the bid
    payementDue: Number, // Note: There's a typo here; ideally, it should be 'paymentDue'
    bidNo: Number,
    bidDate: Date,
    EnteredDate: {
        type: Date,
        default: Date.now,
    },
});

// Optional: Rename 'payementDue' to 'paymentDue' for consistency
// This would require updating all related code
// For now, we'll proceed with the existing field name

module.exports = mongoose.model('Payment', paymentDueSchema);
