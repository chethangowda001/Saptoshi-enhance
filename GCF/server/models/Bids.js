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

// bidSchema.virtual('profit').get(function() {
//   const bidSize = typeof this.BidSize === 'number' ? this.BidSize : 0;
//   const monthDuration = typeof this.MonthDuration === 'number' ? this.MonthDuration : 0;
//   const bidPayOut = typeof this.BidPayOut === 'number' ? this.BidPayOut : 0;
//   const bidManagementAccount = Array.isArray(this.BidManagementAccount) ? this.BidManagementAccount : [];
//   const totalManagementDebit = bidManagementAccount.reduce((acc, account) => {
//     const managementDebit = typeof account.ManagementDebit === 'number' ? account.ManagementDebit : 0;
//     return acc + managementDebit;
//   }, 0);
//   const totalRevenue = bidSize * monthDuration;
//   const totalExpenses = bidPayOut + totalManagementDebit;
//   return totalRevenue - totalExpenses;
// });


// // Enable virtual fields in toJSON and toObject
// bidSchema.set('toJSON', { virtuals: true });
// bidSchema.set('toObject', { virtuals: true });



