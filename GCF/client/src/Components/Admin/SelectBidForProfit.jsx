// src/Components/Admin/SelectBidForProfit.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText, Button } from '@mui/material';
import { toast } from 'react-toastify';

const SelectBidForProfit = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bids'); // Adjust API endpoint if necessary
        setBids(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bids:', err);
        setError('Failed to fetch bids.');
        setLoading(false);
        toast.error('Failed to fetch bids.');
      }
    };

    fetchBids();
  }, []);

  const handleSelectBid = (bidId) => {
    navigate(`/dashboard/profitdashboard/${bidId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Select a Bid to View Profit Dashboard
      </Typography>
      <List>
        {bids.map((bid) => (
          <ListItem key={bid._id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary={`Bid ID: ${bid.BidsId}`} secondary={`Bid Number: ${bid.BidNo}`} />
            <Button variant="contained" color="primary" onClick={() => handleSelectBid(bid._id)}>
              View Profit
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SelectBidForProfit;
