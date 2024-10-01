// src/components/BidsSummary.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BidsSummary = () => {
  const { id } = useParams(); // Extract the bid ID from URL parameters
  const [bid, setBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBidSummary = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/bids/${id}/archive-summary`);
        setBid(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bid summary:', err);
        setError('Failed to fetch bid summary.');
        setLoading(false);
      }
    };

    fetchBidSummary();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="no-data-container">
        <Typography>No bid data available.</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/bids" style={{ textDecoration: 'none' }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ marginBottom: '20px' }}>
          Back to Bids Archive
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        Bid Summary
      </Typography>

      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Bid ID:</strong> {bid.BidsId || bid._id}</Typography>
            <Typography><strong>Start Date:</strong> {formatDate(bid.StartDate)}</Typography>
            <Typography><strong>End Date:</strong> {formatDate(bid.EndDate)}</Typography>
            <Typography><strong>Duration (Months):</strong> {bid.MonthDuration}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Participants Count:</strong> {bid.ParticipantsCount}</Typography>
            <Typography><strong>Bid Size:</strong> {bid.BidSize}</Typography>
            <Typography><strong>AD:</strong> {bid.AD}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Participants Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="participants-content"
          id="participants-header"
        >
          <Typography variant="h6">Participants</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {bid.users.length > 0 ? (
            bid.users.map((user) => (
              <Paper key={user.participantId._id} elevation={1} sx={{ padding: '10px', marginBottom: '10px' }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Name:</strong> {user.userName}</Typography>
                    <Typography><strong>Phone:</strong> {user.userPhoneNo}</Typography>
                    <Typography><strong>Start Date:</strong> {formatDate(user.StartDate)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Bid Win No:</strong> {user.BidWinNo}</Typography>
                    <Typography><strong>Bid Value:</strong> {user.BidValue}</Typography>
                    <Typography><strong>Bid Pay Out:</strong> {user.BidPayOut}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))
          ) : (
            <Typography>No participants found.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Bids Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="bids-content"
          id="bids-header"
        >
          <Typography variant="h6">Bids</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {bid.Bids.length > 0 ? (
            bid.Bids.map((singleBid) => (
              <Accordion key={singleBid.BidNo}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`single-bid-content-${singleBid.BidNo}`}
                  id={`single-bid-header-${singleBid.BidNo}`}
                >
                  <Typography>Bid No: {singleBid.BidNo}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography><strong>Winner:</strong> {singleBid.BidWinner.userName} - {singleBid.BidWinner.phoneNumber}</Typography>
                  <Typography><strong>Value:</strong> {singleBid.BidValue}</Typography>
                  <Typography><strong>Date:</strong> {formatDate(singleBid.BidDate)}</Typography>
                  <Typography><strong>Stake:</strong> {singleBid.BidStake}</Typography>
                  <Typography><strong>Pay Out:</strong> {singleBid.BidPayOut}</Typography>

                  {/* Payment Status */}
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`payment-status-content-${singleBid.BidNo}`}
                      id={`payment-status-header-${singleBid.BidNo}`}
                    >
                      <Typography>Payment Status</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {singleBid.PaymentStatus.length > 0 ? (
                        singleBid.PaymentStatus.map((payment) => (
                          <Paper key={payment.u_id._id} elevation={1} sx={{ padding: '10px', marginBottom: '10px' }}>
                            <Typography><strong>User ID:</strong> {payment.u_id._id}</Typography>
                            <Typography><strong>User Name:</strong> {payment.userName}</Typography>
                            <Typography><strong>Payment:</strong> {payment.payment}</Typography>
                            <Typography><strong>Payed:</strong> {payment.payed ? 'Yes' : 'No'}</Typography>
                          </Paper>
                        ))
                      ) : (
                        <Typography>No payment statuses found.</Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography>No bids found.</Typography>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Bid Management Account Section */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="bid-management-content"
          id="bid-management-header"
        >
          <Typography variant="h6">Bid Management Account</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {bid.BidManagementAccount.length > 0 ? (
            bid.BidManagementAccount.map((account) => (
              <Paper key={account.BidNo} elevation={1} sx={{ padding: '10px', marginBottom: '10px' }}>
                <Typography><strong>Bid No:</strong> {account.BidNo}</Typography>
                <Typography><strong>Management Credit:</strong> {account.ManagementCredit}</Typography>
                <Typography><strong>Management Debit:</strong> {account.ManagementDebit}</Typography>
              </Paper>
            ))
          ) : (
            <Typography>No management account data found.</Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BidsSummary;
