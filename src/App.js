// ✅ React Admin Panel - App.js (Frontend)
import React, { useState, useEffect } from 'react';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', street: '', boxType: '', boxNumber: '', mobile: '', markerNumber: '' });
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    const res = await fetch('https://jmr-fiber-backend.onrender.com/api/customers');
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleEdit = (customer) => {
    setEditingCustomer(customer._id);
    setFormData(customer);
  };

  const handleAddNew = () => {
    setEditingCustomer(null);
    setFormData({ name: '', street: '', boxType: '', boxNumber: '', mobile: '', markerNumber: '' });
  };

  const saveCustomer = async () => {
    const method = editingCustomer ? 'PUT' : 'POST';
    const url = editingCustomer
      ? `https://jmr-fiber-backend.onrender.com/api/customers/${editingCustomer}`
      : 'https://jmr-fiber-backend.onrender.com/api/customers';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('✅ Saved!');
        setEditingCustomer(null);
        setFormData({ name: '', street: '', boxType: '', boxNumber: '', mobile: '', markerNumber: '' });
        loadCustomers();
      } else {
        setError('Failed to save');
      }
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h2>📋 JMR Fiber Admin – Customers</h2>
      <button onClick={handleAddNew}>➕ Add New Customer</button>

      <div style={{ marginTop: '20px' }}>
        <h3>{editingCustomer ? '✏️ Edit Customer' : '➕ New Customer'}</h3>
        <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /><br />
        <input placeholder="Street" value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} /><br />
        <input placeholder="Box Type" value={formData.boxType} onChange={e => setFormData({ ...formData, boxType: e.target.value })} /><br />
        <input placeholder="Box Number" value={formData.boxNumber} onChange={e => setFormData({ ...formData, boxNumber: e.target.value })} /><br />
        <input placeholder="Mobile" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} /><br />
        <input placeholder="Marker Number" value={formData.markerNumber} onChange={e => setFormData({ ...formData, markerNumber: e.target.value })} /><br />
        <button onClick={saveCustomer}>💾 Save</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <hr />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Street</th>
            <th>Box Type</th>
            <th>Box Number</th>
            <th>Mobile</th>
            <th>Marker No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map(c => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.street}</td>
              <td>{c.boxType}</td>
              <td>{c.boxNumber}</td>
              <td>{c.mobile}</td>
              <td>{c.markerNumber}</td>
              <td><button onClick={() => handleEdit(c)}>✏️ Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
