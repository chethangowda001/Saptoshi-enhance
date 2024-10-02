// src/App.js

import React, { useState, useMemo, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch, FormControlLabel } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded components
const Header = lazy(() => import('./Components/Header'));
const Login = lazy(() => import('./Components/Login'));
const SignUp = lazy(() => import('./Components/SignUp'));
const Dashboard = lazy(() => import('./Components/Dashboard'));
const BidderDetails = lazy(() => import('./Components/Admin/BidderDetails'));
const ParticipantDetails = lazy(() => import('./Components/Admin/ParticipantDetails'));
const PaymentStatus = lazy(() => import('./Components/Admin/PaymentStatus'));
const ParticipantDetailsWithBids = lazy(() => import('./Components/Admin/ParticipantDetailsWithBids'));
const BidsSummary = lazy(() => import('./Components/Admin/BidsSummary'));
// const BidArchive = lazy(() => import('./Components/BidArchive')); // Ensure this path is correct

// Optional: ProtectedRoute component (if implemented)
// const ProtectedRoute = lazy(() => import('./Components/ProtectedRoute'));

const App = () => {
  // State for dark mode
  const [darkMode, setDarkMode] = useState(false);

  // Create a theme instance.
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
      },
    }), [darkMode]);

  // Handler to toggle dark mode
  const handleToggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <BrowserRouter>
     <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <ThemeProvider theme={theme}>
        {/* Header Component */}
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}><CircularProgress /></div>}>
          <Header />
        </Suspense>

        {/* Dark Mode Toggle */}
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={handleToggleDarkMode}
                name="darkModeToggle"
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </div>

        {/* Toast Notifications */}
        <ToastContainer />

        {/* Define Routes wrapped in Suspense */}
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}><CircularProgress /></div>}>
          <Routes>
            {/* Redirect root URL to the SignUp page */}
            <Route path="/" element={<Navigate to="/signup" />} />

            {/* Authentication routes */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<Login />} />

            {/* Dashboard and Admin routes */}
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/bidder-details/:bidId" element={<BidderDetails />} />
            <Route path="/participant-details/:id" element={<ParticipantDetails />} />
            <Route path="/dashboard/payment-status/:bidId" element={<PaymentStatus />} />

            {/* Bid-related routes */}
            {/* <Route path="/bids/summary" element={<BidsSummary />} />
            <Route path="/bids/archive" element={<BidArchive />} /> */}

            {/* Route for ParticipantDetailsWithBids */}
            <Route path="/participants/:id/bids" element={<ParticipantDetailsWithBids />} />

            {/* Route for individual bid summary */}
            <Route path="/bids/:id/archive-summary" element={<BidsSummary />} />

            {/* Catch-all route for undefined paths */}
            {/* <Route path="*" element={<Navigate to="/signup" />} /> */}
          </Routes>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
