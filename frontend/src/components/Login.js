// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme(); // Use the theme for consistent styling

  // Function to handle login
  const handleLogin = () => {
    // Ensure username and password are provided
    if (!username || !password) {
      alert('Please enter a username and password');
      return;
    }

    // Make a POST request to obtain the token
    axios
      .post('http://localhost:8000/api/token/', {
        username: username,
        password: password,
      })
      .then((response) => {
        // On success, store the access token using setToken
        const { access } = response.data;
        setToken(access);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('Login failed. Please check your credentials.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper
        style={{
          padding: '30px',
          maxWidth: '400px',
          width: '100%',
          backgroundColor: theme.palette.mode === 'dark' ? '#424242' : '#ffffff',
        }}
      >
        <Typography variant="h4" style={{ marginBottom: '20px', textAlign: 'center' }}>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          fullWidth
          style={{
            padding: '10px',
            backgroundColor: theme.palette.primary.main,
          }}
        >
          Login
        </Button>
      </Paper>
    </div>
  );
};

export default Login;
