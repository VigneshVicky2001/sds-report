import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#171717',
  height: '60px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
}));

const Header = ({ toggleSidebar, showLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <GlassAppBar position="fixed" className="header" sx={{ zIndex: 1201, boxShadow: "none" }}>
      <Toolbar sx={{ height: '100%', padding: '0 20px' }}>
      {/* <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ marginRight: 2 }}
        >
          <MenuIcon sx={{ fontSize: 40, color: '#fff' }} />
        </IconButton> */}

        {/* <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
            fontFamily: 'Poppins, sans-serif',
            flexGrow: 1,
          }}
        >
        </Typography> */}

        <Box sx={{ display: 'flex' }}>
          {showLogout && (
            <IconButton onClick={handleLogout} color="inherit" edge="end">
              <LogoutSharpIcon sx={{ fontSize: 30, color: '#fff' }} />
            </IconButton>
          )}
        </Box>

      </Toolbar>
    </GlassAppBar>
  );
};

export default Header;
