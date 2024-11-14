import React, { useState } from 'react';
import CrudManager from './components/CrudManager';
import Login from './components/Login';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleSetToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <div className="App">
      {token ? (
        <CrudManager token={token} />
      ) : (
        <Login setToken={handleSetToken} />
      )}
    </div>
  );
}

export default App;
