import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../css/NewBid.css'; // Import the custom CSS

const NewBid = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    StartDate: '',
    MonthDuration: '',
    BidSize: '',
    AD: '',
  });

  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/bids/newbid', formData);
      console.log(response.data);
      toast.success('Bid created successfully!');
      setFormData({
        StartDate: '',
        MonthDuration: '',
        BidSize: '',
        AD: '',
      });
    } catch (err) {
      console.error('Error creating bid:', err);
      toast.error('Failed to create bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-bid-container">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />

      <Grid container justifyContent="center" className="mt-4">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Card className="bid-card">
            <CardContent>
              {/* Navigation button at top right */}
              <Button
                variant="contained"
                className="navigate-button"
                onClick={() => navigate('/registeredUsers')}
              >
                Registered Users
              </Button>

              <Typography variant="h5" component="h2" gutterBottom className="text-center">
                Create New Bid
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Start Date */}
                  <Grid item xs={12}>
                    <TextField
                      label="Start Date"
                      type="date"
                      name="StartDate"
                      value={formData.StartDate}
                      onChange={handleChange}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      required
                    />
                  </Grid>

                  {/* Month Duration */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Month Duration"
                      type="number"
                      name="MonthDuration"
                      value={formData.MonthDuration}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 1, max: 60 }}
                    />
                  </Grid>

                  {/* Bid Size */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Bid Size"
                      type="number"
                      name="BidSize"
                      value={formData.BidSize}
                      onChange={handleChange}
                      fullWidth
                      required
                      inputProps={{ min: 1 }}
                    />
                  </Grid>

                  {/* AD */}
                  <Grid item xs={12}>
                    <TextField
                      label="AD"
                      type="text"
                      name="AD"
                      value={formData.AD}
                      onChange={handleChange}
                      fullWidth
                      required
                      placeholder="Enter Additional Details (AD)"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  className="submit-button mt-4"
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default NewBid;
