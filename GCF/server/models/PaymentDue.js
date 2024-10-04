// models/Payment.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentDueSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Participant' }, 
    user_Id : { type: Schema.Types.ObjectId, ref: "users"  },
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



module.exports = mongoose.model('Payment', paymentDueSchema);
