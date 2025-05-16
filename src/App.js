import React, { useState, useEffect } from 'react';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

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

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('https://jmr-fiber-backend.onrender.com/api/customers')
        .then(res => res.json())
        .then(data => setCustomers(data))
        .catch(err => console.error('❌ Failed to load customers', err));
    }
  }, [user]);

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

      {user.role === 'admin' && (
        <>
          <h3>📋 Customer List</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Name</th>
                <th>Street</th>
                <th>Box Type</th>
                <th>Box Number</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(cust => (
                <tr key={cust._id}>
                  <td>{cust.name}</td>
                  <td>{cust.street}</td>
                  <td>{cust.boxType}</td>
                  <td>{cust.boxNumber}</td>
                  <td>{cust.mobile}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default App;
