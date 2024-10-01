import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import "../css/Dashboard.css";
import OngoingBids from "./Admin/OngoingBids";
import BidArchive from "./Admin/BidArchive";
import BidParticipants from "./Admin/BidParticipants";
import Payments from "./Admin/Payments";
import Register from "./Admin/Register";
import ProfitLoss from "./Admin/ProfitLoss";
import NewBid from "./Admin/NewBid";
import BidPage from './Admin/BidPage';
import AddUser from './Admin/AddUser';
import RegisteredUsers from './Admin/RegisteredUsers';
// import ParticipantDetails from './Admin/ParticipantDetails'

const Dashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(null);
  const [activeBidId, setActiveBidId] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirect to login page
  };

  const handleButtonClick = (operation) => {
    switch (operation) {
      case 'Dashboard':
        setActivePage(null);
        navigate('/dashboard');
        break;
      case 'Ongoing':
        setActivePage(<OngoingBids setActivePage={setActivePage} setActiveBidId={setActiveBidId} activeBidId={activeBidId} />);
        navigate('/dashboard/ongoingbids');
        break;
      case 'Archive':
        setActivePage(<BidArchive />);
        navigate('/dashboard/bidarchive');
        break;
      case 'Participants':
        setActivePage(<BidParticipants />);
        navigate('/dashboard/bidparticipants');
        break;
      case 'Payments':
        setActivePage(<Payments />);
        navigate('/dashboard/payments');
        break;
      case 'Register':
        setActivePage(<Register />);
        navigate('/dashboard/register');
        break;
      case 'ProfitLoss':
        setActivePage(<ProfitLoss />);
        navigate('/dashboard/profitloss');
        break;
      case 'NewBid':
        setActivePage(<NewBid />);
        navigate('/dashboard/newbid');
        break;
      case 'AddUser':
        setActivePage(<AddUser />);
        navigate('/dashboard/adduser');
        break;
      case 'RegisteredUsers':
        setActivePage(<RegisteredUsers />);
        navigate('/dashboard/registeredusers');
        break;
      default:
        setActivePage(null);
        break;
    }
  };

  return (
    <div className="dashboard">
    <div className='dashboard-root'>
      <div className="sticky-header">
        <div>
          <h3 id="head">
            Welcome Admin
          </h3>
        </div>
        <div className="logout" onClick={handleLogout}>
          <h2>Logout</h2>
          <i className="ri-logout-box-r-line"></i>
        </div>
      </div>
      <div className="container crud-btn">
        <button className="btn btn-outline-primary" onClick={() => handleButtonClick('Ongoing')}>
          Ongoing Bids
        </button>
        <button className="btn btn-outline-secondary" onClick={() => handleButtonClick('Archive')}>
          Bid Archive
        </button>
        <button className="btn btn-outline-success" onClick={() => handleButtonClick('Payments')}>
          Payments
        </button>
        <button className="btn btn-outline-danger" onClick={() => handleButtonClick('ProfitLoss')}>
          Profit/Loss
        </button>
        <button className="btn btn-outline-warning" onClick={() => handleButtonClick('RegisteredUsers')}>
          Registered Users
        </button>
        <button className="btn btn-outline-info" onClick={() => handleButtonClick('NewBid')}>
          New Bid
        </button>
        <button className="btn btn-outline-success" onClick={() => handleButtonClick('AddUser')}>
          Create User
        </button>
      </div>
      {activePage}
      <div className="container">
        <Routes>
          <Route path="/dashboard/ongoingbids" element={<OngoingBids setActivePage={setActivePage} />} />
          <Route path="/dashboard/bidarchive" element={<BidArchive />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          <Route path="/dashboard/profitloss" element={<ProfitLoss />} />
          <Route path="/dashboard/newbid" element={<NewBid />} />
          <Route path="/dashboard/bid/:id" element={<BidPage activeBidId={activeBidId} />} />
          <Route path="/dashboard/adduser" element={<AddUser />} />
          <Route path="/dashboard/registerduser" element={<RegisteredUsers />} />
        </Routes>
        

      {/* summary was present here */}

      </div>
    </div>
    </div>
  );
}

export default Dashboard;
