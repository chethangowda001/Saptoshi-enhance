// const { findOne } = require('../models/Bids');
const Participant = require('../models/Participants');
const Bids = require("../models/Bids")
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;




exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addParticipant = async (req, res) => {
  const { userName, userPhoneNo, userEmail, address,aadharNo,panNo, } = req.body;
  const profileImageURL = req.file ? `/public/images/${req.file.filename}` : null;


  try {
    const newParticipant = new Participant({ userName, userPhoneNo, userEmail, address,aadharNo,panNo, profileImageURL});
    await newParticipant.save();
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(500).json({ error: 'Error adding participant' });
  }
};

exports.searchParticipants = async (req, res) => {
  const { search } = req.query;

  try {
    const participants = await Participant.find({
      $or: [
        { userName: { $regex: search, $options: 'i' } },
        { userPhoneNo: { $regex: search, $options: 'i' } },
      ]
    });
    res.json(participants);
  } catch (error) {
    console.error('Error searching participants:', error);
    res.status(500).json({ error: 'Server error' });
  }
};




exports.getOneCompleteParticipant = async (req, res) => {
  try {
    const id = req.params.id;
    const participant = await Participant.findById(id); 
    if (!participant) {
      return res.status(404).json({ message: "Participant not found", success: false });
    }
    res.status(200).json({ message: "User's complete details", success: true, data: participant });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false, error });
  }
};

// controllers/participantsController.js


exports.getParticipantDetailsWithBids = async (req, res) => {
  try {
    const participantIdStr = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(participantIdStr)) {
      return res.status(400).json({ message: 'Invalid participant ID', success: false });
    }

    const participantId = new ObjectId(participantIdStr);

    console.log(`Fetching details for Participant ID: ${participantId}`);

    // Fetch participant details
    const participantDetails = await Participant.findById(participantId);
    console.log('Participant Details:', participantDetails);

    if (!participantDetails) {
      return res.status(404).json({ message: 'Participant not found', success: false });
    }

    // Aggregate bids with payment details for the specific participant
    const participantBids = await Bids.aggregate([
      { $unwind: "$users" }, // Unwind users array to match each participant
      { $match: { "users.participantId": participantId } }, // Match the participantId
      {
        $lookup: {
          from: 'participants', // Lookup from the 'participants' collection
          localField: 'users.participantId',
          foreignField: '_id',
          as: 'participantDetails'
        }
      },
      { $unwind: "$Bids" }, // Unwind the Bids array to access the details of each bid
      {
        $project: {
          "Bids.BidNo": 1,
          "Bids.BidWinner": 1,
          "Bids.BidValue": 1,
          "Bids.PaymentStatus": 1,
          "users.BidValue": 1, 
          "users.BidPayOut": 1,
          "users.BidWinNo": 1
        }
      }
    ]);

    console.log('Participant Bids:', participantBids);

    // Send the participant details along with bid and payment information
    return res.status(200).json({
      success: true, // Added success field
      participantDetails,
      bids: participantBids
    });

  } catch (error) {
    console.error("Error in getParticipantDetailsWithBids:", error);
    res.status(500).json({ message: 'Server Error', success: false, error: error.message });
  }
};

exports.deleteParticipantDetails = async (req, res) => {
  const { id } = req.params;

  // Check if id is valid
  if (!id) {
    return res.status(400).json({ message: "Invalid participant ID" });
  }

  try {
    // Find and delete the participant
    const participant = await Participant.findByIdAndDelete(id);

    // If no participant was found
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Successful deletion
    res.status(200).json({ message: "Participant successfully deleted" });
  } catch (error) {
    // Log and return an internal server error message
    console.error("Error deleting participant:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.updateParticipantsDetails = async (req, res) => {
  const { id } = req.params;
  
  // Validate participant ID
  if (!id) {
    return res.status(400).json({ message: "Participant ID is required" });
  }

  const participantDetails = req.body;

  try {
    // Find participant by ID and update details
    const updatedParticipant = await Participant.findByIdAndUpdate(
      id,
      { $set: participantDetails }, // Use $set to update only the fields provided in the body
      { new: true, runValidators: true } // Return the updated document and run validation on the updates
    );

    // If no participant is found with the provided ID
    if (!updatedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Successful update
    res.status(200).json({ message: "Participant updated successfully", data: updatedParticipant });
  } catch (error) {
    // Log and return an internal server error message
    console.error("Error updating participant details:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


