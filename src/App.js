
import React, { useState } from 'react';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const res = await fetch('https://jmr-fiber-backend.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    } else {
      alert("Invalid login!");
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '30px' }}>
        <h2>Login to JMR Fiber</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button onClick={handleLogin}>Login</button>
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
