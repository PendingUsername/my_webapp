// src/App.js

import React, { useState, useEffect } from 'react';
import HelloBeyondMD from './components/HelloBeyondMD';
import CrudManager from './components/CrudManager';
import Login from './components/Login';  // Make sure the case matches exactly

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

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

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="App">
      <header>
        <h1>Welcome to BeyondMD CRUD Application</h1>
        <button
          onClick={handleLogout}
          style={{
            float: 'right',
            padding: '10px',
            background: 'red',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>
      <HelloBeyondMD />
      <CrudManager token={token} /> {/* Pass the token to CrudManager */}
    </div>
  );
}

export default App;
