// src/Components/Dashboard.js

import React from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  Box,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArchiveIcon from '@mui/icons-material/Archive';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SummarizeIcon from '@mui/icons-material/Summarize'; // Correct Icon Import

// Import your admin components
import OngoingBids from './Admin/OngoingBids';
import BidArchive from './Admin/BidArchive';
import BidParticipants from './Admin/BidParticipants';
import Payments from './Admin/Payments';
import Register from './Admin/Register';
import ProfitLoss from './Admin/ProfitLoss';
import NewBid from './Admin/NewBid';
import BidPage from './Admin/BidPage';
import AddUser from './Admin/AddUser';
import RegisteredUsers from './Admin/RegisteredUsers';
// import ProfitSummary from './Admin/ProfitSummary'; // Assuming you have this component

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin'); // Redirect to login page
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Ongoing Bids', icon: <DashboardIcon />, path: '/dashboard/ongoingbids' },
    { text: 'Bid Archive', icon: <ArchiveIcon />, path: '/dashboard/bidarchive' },
    { text: 'Participants', icon: <PeopleIcon />, path: '/dashboard/bidparticipants' },
    { text: 'Payments', icon: <PaymentIcon />, path: '/dashboard/payments' },
    { text: 'Profit/Loss', icon: <TrendingUpIcon />, path: '/dashboard/profitloss' },
    { text: 'Registered Users', icon: <PeopleIcon />, path: '/dashboard/registeredusers' },
    { text: 'New Bid', icon: <AddCircleIcon />, path: '/dashboard/newbid' },
    { text: 'Create User', icon: <PersonAddIcon />, path: '/dashboard/adduser' },
    { text: 'Profit Summary', icon: <SummarizeIcon />, path: '/dashboard/profitsummary' },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false); // Close drawer on mobile after navigation
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            {menuItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Drawer for desktop and mobile */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="admin navigation"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Routes>
          {/* Redirect /dashboard to /dashboard/ongoingbids */}
          <Route path="/" element={<Navigate to="ongoingbids" replace />} />

          {/* Define nested routes */}
          <Route path="ongoingbids" element={<OngoingBids />} />
          <Route path="bidarchive" element={<BidArchive />} />
          <Route path="bidparticipants" element={<BidParticipants />} />
          <Route path="payments" element={<Payments />} />
          <Route path="profitloss" element={<ProfitLoss />} />
          <Route path="registeredusers" element={<RegisteredUsers />} />
          <Route path="newbid" element={<NewBid />} />
          <Route path="adduser" element={<AddUser />} />
          {/* <Route path="profitsummary" element={<ProfitSummary />} />  */}
          <Route path="bid/:id" element={<BidPage />} />
          {/* Add more nested routes as needed */}

          {/* Catch-all for undefined nested routes */}
          <Route path="*" element={<Navigate to="ongoingbids" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
