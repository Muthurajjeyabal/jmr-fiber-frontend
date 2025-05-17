import React, { useState, useEffect } from 'react';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [bills, setBills] = useState([]);

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
    if (user?.role === 'collector') {
      fetch("https://jmr-fiber-backend.onrender.com/api/bills")
        .then(res => res.json())
        .then(data => setBills(data))
        .catch(err => console.error("Error loading bills:", err));
    }
  }, [user]);

  const handlePay = async (id) => {
    await fetch(`https://jmr-fiber-backend.onrender.com/api/bills/${id}/pay`, {
      method: "PUT",
    });
    setBills(bills.map(b => b._id === id ? { ...b, status: "paid", paidDate: new Date() } : b));
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

      {user.role === 'collector' && (
        <>
          <h3>Unpaid Bills (Your Streets)</h3>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Street</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bills
                .filter(b =>
                  b.status === 'unpaid' &&
                  user.assignedStreets.includes(b.customerId?.street)
                )
                .map(b => (
                  <tr key={b._id}>
                    <td>{b.customerId?.name}</td>
                    <td>{b.customerId?.street}</td>
                    <td>{b.month}</td>
                    <td>{b.amount}</td>
                    <td>{b.status}</td>
                    <td>
                      <button onClick={() => handlePay(b._id)}>Mark Paid</button>
                    </td>
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
