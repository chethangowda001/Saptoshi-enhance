// models/Audit.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditSchema = new Schema({
  action: String, // e.g., 'MARK_PAID', 'UPDATE_PAYMENT_DUE'
  performedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
  details: Schema.Types.Mixed, // Additional details
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Audit', auditSchema);
