import React, { useState } from 'react';

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
      console.log("📩 Response from backend:", data);

      if (res.ok && data.user) {
        setUser(data.user);
        setError('');
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Frontend error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

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

  return (
    <div style={{ padding: '30px' }}>
      <h2>Welcome {user.role === 'admin' ? 'Admin' : 'Collector'}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Assigned Streets: {user.assignedStreets?.join(', ')}</p>
    </div>
  );
};

export default App;
