import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button } from '@mui/material';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleLogin = () => {
    // Ensure username and password are provided
    if (!username || !password) {
      alert('Please enter a username and password');
      return;
    }

    // Make a POST request to obtain the token
    axios.post('http://localhost:8000/api/token/', {
      username: username,
      password: password,
    })
    .then(response => {
      // On success, store the access token using setToken
      const { access, refresh } = response.data;
      setToken(access);
      localStorage.setItem('accessToken', access);   // Store the access token in localStorage
      localStorage.setItem('refreshToken', refresh); // Store the refresh token in localStorage
      alert('Login successful!');
    })
    .catch(error => {
      console.error('Error during login:', error);
      alert('Login failed. Please check your credentials.');
    });
  };

  // Function to handle logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('accessToken'); // Remove the access token from localStorage
    localStorage.removeItem('refreshToken'); // Remove the refresh token from localStorage
    alert('You have been logged out.');
  };

  return (
    <div>
      <h2>Login</h2>
      <p>Please enter username and password</p>
      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: '10px' }}
      />
      <br />
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
      <br /><br />
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
};

export default Login;
