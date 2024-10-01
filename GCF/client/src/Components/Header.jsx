// src/Components/Header.js

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const Logo = styled('img')(({ theme }) => ({
  height: 40,
  marginRight: theme.spacing(2),
}));

const Header = ({ toggleTheme, currentTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Logo */}
          <Logo src="/img/logo1.png" alt="Logo" />

          {/* Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white', fontWeight: 'bold' }}>
            SAPTOSI CHIT FUND
          </Typography>

          {/* Theme Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton sx={{ ml: 1 }} color="inherit" onClick={toggleTheme}>
              {currentTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Switch checked={currentTheme === 'dark'} onChange={toggleTheme} color="default" />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
