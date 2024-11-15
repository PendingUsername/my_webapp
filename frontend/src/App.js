// src/App.js

import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar, Typography, IconButton, Switch } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import HelloBeyondMD from './components/HelloBeyondMD';
import CrudManager from './components/CrudManager';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    alert('You have been logged out.');
  };

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
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
            margin: '5px',
          },
        },
      },
    },
  });

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
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Switch checked={darkMode} onChange={handleThemeChange} />
          <button
            onClick={handleLogout}
            style={{
              padding: '10px',
              background: darkMode ? '#f44336' : '#1976d2',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: '20px' }}>
        <HelloBeyondMD />
        <CrudManager token={token} />
      </div>
    </ThemeProvider>
  );
}

export default App;
