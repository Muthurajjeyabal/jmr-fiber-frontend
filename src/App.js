import React, { useState, useEffect } from 'react';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch('https://jmr-fiber-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  // 👇 Show login page first if no user is logged in
  if (!user) {
    return (
      <div style={{ padding: '30px' }}>
        <h2>Login to JMR Fiber</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br />
        <button onClick={handleLogin}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  // ✅ Logged in? Show admin dashboard
  return (
    <div style={{ padding: '30px' }}>
      <h2>📋 JMR Fiber Admin – Customers</h2>
      {/* ➕ Add New Customer form */}
      {/* Customer list table */}
    </div>
  );
};

export default App;
