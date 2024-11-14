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
      const { access } = response.data;
      setToken(access);
      alert('Login successful!');
    })
    .catch(error => {
      console.error('Error during login:', error);
      alert('Login failed. Please check your credentials.');
    });
  };

  return (
    <div>
      <h2>Login</h2>
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
    </div>
  );
};

export default Login;
