import React from 'react';
import '../css/Header.css';

const Header = () => {
  return (
    <div className="header-container d-flex justify-content-between align-items-center">
      <div className="header-logo text-left">
        SAPTOSI CHIT FUND
      </div>
      <div className="header-logo-image">
        <img src="/img/logo1.png" alt="Logo" />
      </div>
    </div>
  );
};

export default Header;
