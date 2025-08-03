import React from 'react';
import { Box } from '@mui/material';

export default function ContentLoaderOverlay() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: '12px',
        backdropFilter: 'blur(1px)',
      }}
    >
      <Box
        className="custom-spinner"
        sx={{
          // ml: 35,
          width: 68,
          height: 68,
          border: '5px solid rgba(255,255,255,0.1)',
          borderTop: '5px solid #ffffffff',
          borderRadius: '50%',
        }}
      />
      <style>{`
        @keyframes spinEase {
          0%   { transform: rotate(0deg);   }
          50%  { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
        .custom-spinner {
          animation: spinEase 1s ease-in-out infinite;
        }
      `}</style>
    </Box>
  );
}
