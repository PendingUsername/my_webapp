// src/App.js

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Switch,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HelloBeyondMD from './components/HelloBeyondMD';
import CrudManager from './components/CrudManager';
import Login from './components/Login';

function App() {
  // State for storing the token to manage user authentication
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null; // Initialize token from localStorage
  });

  // State to manage the dark/light mode of the theme
  const [darkMode, setDarkMode] = useState(false);

  // State to manage drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  // State to store items for exporting
  const [items, setItems] = useState([]);

  // Store or remove token in localStorage whenever token state changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token); // Save token if available
    } else {
      localStorage.removeItem('token'); // Remove token if not available
    }
  }, [token]);

  // Function to handle user logout
  const handleLogout = () => {
    setToken(null); // Clear token
    alert('You have been logged out.');
  };

  // Function to toggle between dark and light mode
  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  // Function to toggle the drawer
  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  // Create a theme with dark or light mode based on user preference
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light', // Set the mode based on darkMode state
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            margin: '5px', // Add margin to all buttons for consistent spacing
          },
        },
      },
    },
  });

  // If no token is present, render the Login component
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            BeyondMD CRUD Application
          </Typography>
          <IconButton onClick={handleThemeChange} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />} {/* Toggle dark/light mode icon */}
          </IconButton>
          <Switch checked={darkMode} onChange={handleThemeChange} /> {/* Dark/light mode switch */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer component */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            <ListItem button onClick={handleThemeChange}>
              <IconButton edge="start" color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <ListItemText primary="Toggle Dark Mode" />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <div style={{ padding: '20px' }}>
        <HelloBeyondMD /> {/* Display a simple greeting component */}
        <CrudManager token={token} setItems={setItems} /> {/* CRUD management component, passing the token for API requests */}
      </div>
    </ThemeProvider>
  );
}

export default App;
