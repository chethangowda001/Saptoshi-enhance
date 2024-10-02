// src/Components/Admin/ParticipantDetailsWithBids.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DescriptionIcon from '@mui/icons-material/Description';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

// Styled components using Emotion via MUI's styled API
const ProfileCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const ProfileDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const ProfileImage = styled(CardMedia)(({ theme }) => ({
  width: 200,
  height: 200,
  objectFit: 'cover',
  borderRadius: '50%',
  margin: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: 150,
    height: 150,
  },
}));

const ParticipantDetailsWithBids = () => {
  const { id } = useParams(); // Extract 'id' from URL parameters
  const navigate = useNavigate(); // For navigation
  const [participantData, setParticipantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize react-toastify
  useEffect(() => {
    // Optional: Customize toast notifications here if needed
  }, []);

  // Fetch participant details along with bids
  useEffect(() => {
    // Check if 'id' exists
    if (!id) {
      console.error('Participant ID is missing in the URL.');
      setError('Participant ID is missing in the URL.');
      setLoading(false);
      return;
    }

    const fetchParticipantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/participants/${id}/bids`);

        if (response.data.success) {
          setParticipantData(response.data);
          toast.success('Participant data fetched successfully!');
        } else {
          setError(response.data.message || 'Failed to fetch participant data');
          toast.error(response.data.message || 'Failed to fetch participant data');
        }
      } catch (err) {
        console.error('Error fetching participant details:', err);
        setError('Error fetching participant details');
        toast.error('Error fetching participant details');
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantDetails();
  }, [id]);

  // Handle navigation back to registered users
  const handleBack = () => {
    navigate('/dashboard/registeredusers');
  };

  // Handle navigation to Participant Details
  const handleViewParticipantDetails = () => {
    navigate(`/participant-details/${id}`);
  };

  // Render loading state
  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Participant Details...
        </Typography>
      </Container>
    );
  }

  // Render error state
  if (error) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back to Registered Users
          </Button>
        </Box>
      </Container>
    );
  }

  // Render when no data is available
  if (!participantData) {
    return (
      <Container sx={{ mt: 10 }}>
        <Alert severity="warning">No participant data available.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleBack} startIcon={<ArrowBackIcon />}>
            Back to Registered Users
          </Button>
        </Box>
      </Container>
    );
  }

  const { participantDetails, bids } = participantData;

  return (
    <Container sx={{ mt: 5, mb: 5 }}>
      {/* Participant Information */}
      <ProfileCard>
        {participantDetails.profileImageURL ? (
          <ProfileImage
            component="img"
            image={`http://localhost:3001${participantDetails.profileImageURL}`}
            alt={`${participantDetails.userName}'s profile`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default-profile.png'; // Provide a default image path
            }}
          />
        ) : (
          <ProfileImage
            component="img"
            image="/default-profile.png" // Provide a default image path
            alt="Default Profile"
          />
        )}
        <ProfileDetails>
          <Typography variant="h5" gutterBottom>
            {participantDetails.userName}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {participantDetails.userEmail}
          </Typography>
          <Typography variant="body1">
            <strong>Phone No:</strong> {participantDetails.userPhoneNo}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {participantDetails.address}
          </Typography>
          <Typography variant="body1">
            <strong>Aadhar No:</strong> {participantDetails.aadharNo}
          </Typography>
          <Typography variant="body1">
            <strong>PAN No:</strong> {participantDetails.panNo}
          </Typography>
          <Typography variant="body1">
            <strong>Document:</strong>{' '}
            {participantDetails.document ? (
              <Tooltip title="View Document">
                <IconButton
                  component="a"
                  href={`http://localhost:3001/${participantDetails.document}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  <DescriptionIcon />
                </IconButton>
              </Tooltip>
            ) : (
              'No Document'
            )}
          </Typography>
          <Typography variant="body1">
            <strong>Created At:</strong> {new Date(participantDetails.createdAt).toLocaleDateString()}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleViewParticipantDetails} startIcon={<VisibilityIcon />}>
              View Participant Details
            </Button>
          </Box>
        </ProfileDetails>
      </ProfileCard>

      {/* Bids Table */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Bids
        </Typography>
        {bids.length > 0 ? (
          <TableContainer component={Paper}>
            <Table aria-label="bids table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Bid No</StyledTableCell>
                  <StyledTableCell align="center">Bid Winner</StyledTableCell>
                  <StyledTableCell align="center">Winner Phone</StyledTableCell>
                  <StyledTableCell align="center">Bid Value</StyledTableCell>
                  <StyledTableCell align="center">Bid PayOut</StyledTableCell>
                  <StyledTableCell align="center">Payment Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bids.map((bid, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">{bid.Bids.BidNo}</TableCell>
                    <TableCell align="center">{bid.Bids.BidWinner?.userName || 'Unknown'}</TableCell>
                    <TableCell align="center">{bid.Bids.BidWinner?.phoneNumber || 'Unknown'}</TableCell>
                    <TableCell align="center">{bid.Bids.BidValue}</TableCell>
                    <TableCell align="center">{bid.users.BidPayOut.toFixed(2)}</TableCell>
                    <TableCell align="center">
                      {bid.Bids.PaymentStatus.length > 0 ? (
                        <Box>
                          {bid.Bids.PaymentStatus.map((payment, idx) => (
                            <Typography key={idx} variant="body2" color={payment.payed ? 'green' : 'error'}>
                              {payment.userName}: {payment.payment} ({payment.payed ? 'Paid' : 'Not Paid'})
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        'No payment data'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="info">No bids available for this participant.</Alert>
        )}
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" color="secondary" onClick={handleBack} startIcon={<ArrowBackIcon />}>
          Back to Registered Users
        </Button>
        {/* Add more action buttons here if needed */}
      </Box>
    </Container>
  );
};

export default ParticipantDetailsWithBids;
