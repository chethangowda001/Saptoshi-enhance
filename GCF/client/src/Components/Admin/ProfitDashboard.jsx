// src/Components/Admin/ProfitDashboard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import 'chart.js/auto';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ProfitDashboard = () => {
  const { bidId } = useParams(); // Get bidId from route parameters
  const [profitData, setProfitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/bids/${bidId}/profit`);
        setProfitData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profit data:', err);
        setError(true);
        setLoading(false);
        toast.error('Failed to fetch profit data.');
      }
    };

    fetchProfitData();
  }, [bidId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !profitData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <Alert severity="error">Failed to load profit data.</Alert>
      </Box>
    );
  }

  const { totalRevenue, totalExpenses, profit, bidPayOut, totalManagementDebit, bidSize, monthDuration } = profitData;

  const pieData = {
    labels: ['Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Revenue vs Expenses',
        data: [totalRevenue, totalExpenses],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const lineData = {
    labels: ['Revenue', 'Expenses', 'Profit'],
    datasets: [
      {
        label: 'Financial Overview',
        data: [totalRevenue, totalExpenses, profit],
        fill: false,
        backgroundColor: '#4bc0c0',
        borderColor: '#4bc0c0',
      },
    ],
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profit Dashboard
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Revenue vs Expenses
          </Typography>
          <Pie data={pieData} />
        </Box>
        <Box sx={{ width: '100%', maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Financial Overview
          </Typography>
          <Line data={lineData} />
        </Box>
      </Box>
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Detailed Breakdown:</Typography>
        <ul>
          <li><strong>Total Revenue:</strong> ${totalRevenue.toFixed(2)}</li>
          <li><strong>Total Expenses:</strong> ${totalExpenses.toFixed(2)}</li>
          <li><strong>Total Payout:</strong> ${bidPayOut.toFixed(2)}</li>
          <li><strong>Total Management Debit:</strong> ${totalManagementDebit.toFixed(2)}</li>
          <li><strong>Bid Size:</strong> ${bidSize.toFixed(2)}</li>
          <li><strong>Duration:</strong> {monthDuration} months</li>
          <li><strong>Profit:</strong> ${profit.toFixed(2)}</li>
        </ul>
      </Box>
    </Box>
  );
};

export default ProfitDashboard;
