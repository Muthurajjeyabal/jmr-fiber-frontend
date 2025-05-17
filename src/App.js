import React, { useState, useEffect } from 'react';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchStreet, setSearchStreet] = useState('');

  useEffect(() => {
    fetch('https://jmr-fiber-backend.onrender.com/api/customers')
      .then(res => res.json())
      .then(data => {
        setCustomers(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    const result = customers.filter(c =>
      c.name.toLowerCase().includes(searchName.toLowerCase()) &&
      c.street.toLowerCase().includes(searchStreet.toLowerCase())
    );
    setFiltered(result);
  }, [searchName, searchStreet, customers]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📋 Customer List (Filter Enabled)</h2>

      <input
        type="text"
        placeholder="Search by Name"
        value={searchName}
        onChange={e => setSearchName(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <input
        type="text"
        placeholder="Search by Street"
        value={searchStreet}
        onChange={e => setSearchStreet(e.target.value)}
        style={{ padding: '5px' }}
      />

      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%' }}>
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
          {filtered.map((c, index) => (
            <tr key={index}>
              <td>{c.name}</td>
              <td>{c.street}</td>
              <td>{c.boxType}</td>
              <td>{c.boxNumber}</td>
              <td>{c.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
