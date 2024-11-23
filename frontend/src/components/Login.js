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

// Login component to handle user login and superuser creation
const Login = ({ setToken }) => {
  // State for login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // State for superuser dialog and new superuser details
  const [isSuperuserDialogOpen, setIsSuperuserDialogOpen] = useState(false);
  const [newSuperuserDetails, setNewSuperuserDetails] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Use theme to apply consistent styling
  const theme = useTheme();

  // Handle user login
  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter a username and password');
      return;
    }

    // Make API request to authenticate user and obtain token
    axios
      .post('http://localhost:8000/api/token/', {
        username: username,
        password: password,
      })
      .then((response) => {
        const { access } = response.data;
        setToken(access); // Store token for authenticated requests
        alert('Login successful!');
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('Login failed. Please check your credentials.');
      });
  };

  // Open dialog to create a new superuser
  const handleOpenSuperuserDialog = () => {
    setIsSuperuserDialogOpen(true);
  };

  // Close superuser creation dialog and reset fields
  const handleCloseSuperuserDialog = () => {
    setIsSuperuserDialogOpen(false);
    setNewSuperuserDetails({ newUsername: '', newPassword: '', confirmPassword: '' });
  };

  // Handle input changes for the new superuser form
  const handleSuperuserInputChange = (field, value) => {
    setNewSuperuserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  // Handle creation of a new superuser
  const handleCreateSuperuser = () => {
    const { newUsername, newPassword, confirmPassword } = newSuperuserDetails;

    // Ensure all fields are filled
    if (!newUsername || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Make API request to create a new superuser
    axios
      .post('http://localhost:8000/api/create-superuser/', {
        username: newUsername,
        password: newPassword,
      })
      .then((response) => {
        alert(response.data.message);
        handleCloseSuperuserDialog(); // Close dialog on success
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
        elevation={3}
        style={{
          padding: '40px',
          maxWidth: '450px',
          width: '100%',
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h4"
          style={{ marginBottom: '30px', textAlign: 'center', fontWeight: 'bold' }}
          color="primary"
        >
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update username state
          style={{ marginBottom: '20px' }}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
          style={{ marginBottom: '30px' }}
        />
        <Box display="flex" gap="15px" marginBottom="30px">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin} // Trigger login function
            fullWidth
            style={{
              padding: '12px',
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleOpenSuperuserDialog} // Open superuser creation dialog
            fullWidth
            style={{
              padding: '12px',
            }}
          >
            Create User
          </Button>
        </Box>
      </Paper>

      {/* Dialog for creating a new superuser */}
      <Dialog open={isSuperuserDialogOpen} onClose={handleCloseSuperuserDialog}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.newUsername}
            onChange={(e) => handleSuperuserInputChange('newUsername', e.target.value)} // Update new superuser username
            style={{ marginBottom: '20px' }}
          />
          <TextField
            type="password"
            label="Password"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.newPassword}
            onChange={(e) => handleSuperuserInputChange('newPassword', e.target.value)} // Update new superuser password
            style={{ marginBottom: '20px' }}
          />
          <TextField
            type="password"
            label="Confirm Password"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.confirmPassword}
            onChange={(e) => handleSuperuserInputChange('confirmPassword', e.target.value)} // Update password confirmation
            style={{ marginBottom: '20px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuperuserDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateSuperuser} variant="contained" color="secondary">
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Login;
