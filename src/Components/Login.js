import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin') {
      navigate('/dashboard');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 90px)',
        backgroundColor: '#212121',
        color: '#fff',
        paddingBottom: '30px',
      }}
    >

      <Container 
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: 4,
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.4)',
        }}
      >      
    <Typography 
      variant="h3" 
      sx={{ 
        marginBottom: 4, 
        fontWeight: 'bold', 
        letterSpacing: '0.15em', 
        color: '#e3f2fd', 
        textShadow: '0px 0px 10px rgba(255,255,255,0.5)',
        textAlign: 'center',
      }}
    >
      LOGIN
    </Typography>
        <TextField
          sx={{ 
            width: '300px', 
            marginBottom: 3, 
            '& .MuiInputBase-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.2)',
            },
          }}
          required
          id="username"
          placeholder="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="small"
          InputProps={{ sx: { color: '#fff' } }}
        />
        <TextField
          sx={{ 
            width: '300px', 
            marginBottom: 3,
            '& .MuiInputBase-root': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.2)',
            },
          }}
          required
          name="password"
          placeholder="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          InputProps={{ sx: { color: '#fff' } }}
        />
        <Button
          variant="contained"
          sx={{
            paddingY: 1.5, 
            width: '300px', 
            backgroundColor: '#00b0ff',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            '&:hover': {
              backgroundColor: 'transparent',
              transform: 'scale(0.96)',
              boxShadow: `inset 0px 0px 15px rgba(0, 0, 0, 0)`,
              transition: '0.3s ease, transform 0.3s ease',
              background: 'rgba(255, 255, 255, 0.08)',
            },
            '&:active': {
              boxShadow: `inset 0px 0px 15px rgba(0, 0, 0, 1)`,
              transform: 'scale(0.95)',
            },
            textShadow: '0px 0px 12px rgba(255,255,255,0.5)',
          }} 
          onClick={handleLogin}
          size="large"
        >
          Login
        </Button>
      </Container>
    </Box>
  );
};

export default Login;
