const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paymentDueSchema = new Schema({
    userId: {type: Schema.Types.ObjectId},
    useerName : String,
    userPhoneNo : String,
    bidId : {type: Schema.Types.ObjectId},
    payementDue : Number,
    bidNo: Number,
    bidDate : Date,
    EnteredDate :  {
        type: Date,
        default: Date.now,
    },
});

// data from BidPage --- {bidData, userId, BidNo}
module.exports = mongoose.model('Payment', paymentDueSchema);
