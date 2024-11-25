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
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// Login component to handle user login and superuser creation
const Login = ({ setToken }) => {
  // State for login credentials
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // State for superuser dialog and new superuser details
  const [isSuperuserDialogOpen, setIsSuperuserDialogOpen] = useState(false);
  const [newSuperuserDetails, setNewSuperuserDetails] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewSuperuserPassword, setShowNewSuperuserPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Toggle password visibility
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Toggle new superuser password visibility
  const handleToggleNewSuperuserPasswordVisibility = () => {
    setShowNewSuperuserPassword((prevShowPassword) => !prevShowPassword);
  };

  // Toggle confirm password visibility
  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
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
          Login to BeyondMD CRUD
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
          type={showPassword ? 'text' : 'password'}
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '30px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" gap="15px" marginBottom="30px">
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
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
            onClick={handleOpenSuperuserDialog}
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
            onChange={(e) => handleSuperuserInputChange('newUsername', e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <TextField
            type={showNewSuperuserPassword ? 'text' : 'password'}
            label="Password"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.newPassword}
            onChange={(e) => handleSuperuserInputChange('newPassword', e.target.value)}
            style={{ marginBottom: '20px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleNewSuperuserPasswordVisibility}
                    edge="end"
                  >
                    {showNewSuperuserPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            variant="outlined"
            fullWidth
            value={newSuperuserDetails.confirmPassword}
            onChange={(e) => handleSuperuserInputChange('confirmPassword', e.target.value)}
            style={{ marginBottom: '20px' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleToggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
