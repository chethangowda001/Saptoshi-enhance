const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bidSchema = new Schema({
  BidsId: String,
  StartDate: Date,
  EndDate: Date,
  MonthDuration: Number,
  ParticipantsCount: { type: Number, default: 0 },
  BidSize: Number,
  AD: String,
  users: [
    {
      participantId: {
        type: Schema.Types.ObjectId,
        ref: 'Participant'
      },
      userName: String,
      userPhoneNo: String,
      StartDate: {
        type: Date,
        default: Date.now,
      },
      BidWinNo: {type: Number, default: 0},
      BidValue: {type: Number, default: 0},
      BidPayOut:{type: Number, default: 0},
    }
  ],
  Bids: [
    {
      BidNo: Number,
      BidWinner: {
        userName: String,
        phoneNumber: String,
      },
      BidValue: Number,
      BidDate: Date,
      BidStake: Number,
      BidPayOut: Number,
      PaymentStatus: [
        {
          u_id: { type: Schema.Types.ObjectId, ref: 'users' },
          userName: { type: String, ref: 'users'},
          payment: Number,
          payed: Boolean,
        }
      ],
      BidStart: {type: Boolean, default: false},
      
      BidClose: {type: Boolean, default: false},
    }
  ],
  BidManagementAccount: [
    {
      BidNo: Number,
      ManagementCredit: Number,
      ManagementDebit: Number,
    }
  ],
});


module.exports = mongoose.model('Bids', bidSchema); 
