// src/components/Login.js

import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSuperuserDialogOpen, setIsSuperuserDialogOpen] = useState(false);
  const [newSuperuserDetails, setNewSuperuserDetails] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });
  const theme = useTheme(); // Use the theme for consistent styling

  // Function to handle login
  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter a username and password');
      return;
    }

    axios
      .post('http://localhost:8000/api/token/', {
        username: username,
        password: password,
      })
      .then((response) => {
        const { access } = response.data;
        setToken(access);
        alert('Login successful!');
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('Login failed. Please check your credentials.');
      });
  };

  // Function to open the create superuser dialog
  const handleOpenSuperuserDialog = () => {
    setIsSuperuserDialogOpen(true);
  };

  // Function to close the create superuser dialog
  const handleCloseSuperuserDialog = () => {
    setIsSuperuserDialogOpen(false);
    setNewSuperuserDetails({ newUsername: '', newPassword: '', confirmPassword: '' });
  };

  // Function to handle changes in superuser form inputs
  const handleSuperuserInputChange = (field, value) => {
    setNewSuperuserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Function to handle superuser creation
  const handleCreateSuperuser = () => {
    const { newUsername, newPassword, confirmPassword } = newSuperuserDetails;

    if (!newUsername || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    axios
      .post('http://localhost:8000/api/create-superuser/', {
        username: newUsername,
        password: newPassword,
      })
      .then((response) => {
        alert(response.data.message);
        handleCloseSuperuserDialog(); // Close the dialog after successful superuser creation
      })
      .catch((error) => {
        console.error('Error creating superuser:', error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('Failed to create superuser.');
        }
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
        <Box display="flex" gap="10px" marginBottom="20px">
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
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenSuperuserDialog}
            fullWidth
            style={{
              padding: '10px',
            }}
          >
            Create User
          </Button>
        </Box>
      </Paper>

      {/* Dialog for Creating Superuser */}
      <Dialog open={isSuperuserDialogOpen} onClose={handleCloseSuperuserDialog}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.newUsername}
            onChange={(e) => handleSuperuserInputChange('newUsername', e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.newPassword}
            onChange={(e) => handleSuperuserInputChange('newPassword', e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            type="password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.confirmPassword}
            onChange={(e) => handleSuperuserInputChange('confirmPassword', e.target.value)}
            style={{ marginBottom: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuperuserDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSuperuser} color="secondary">
            Create user
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
