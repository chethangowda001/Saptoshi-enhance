// models/Participant.js

const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userPhoneNo: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    unique: true,
  },
  address: {
    type: String,
    required: false,
  },
  aadharNo: {
    type: String,
    required: false,
  },
  panNo: {
    type: String,
    required: false,
  },
  profileImageURL: {
    type: String,
    default: "images/default.png",
    required: false,
  },
  document: {
    type: String,
    default: "images/default.png",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps: true});

module.exports = mongoose.model('Participant', ParticipantSchema);
