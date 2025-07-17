import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        padding: '2px', 
        backgroundColor: '#171717', 
        color: '#fff', 
        textAlign: 'center', 
        position: 'fixed', 
        bottom: 0, 
        width: '100%',
        height: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
    }}
    >
      {/* <Typography variant="body2">
        &copy;
      </Typography> */}
    </Box>
  );
};

export default Footer;
