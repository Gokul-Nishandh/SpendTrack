import React, { useEffect, useState } from 'react';

const Recents = ({ userId }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    })
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error("Expected array, got:", data);
          setTransactions([]);
          return;
        }
        // Parse date and amount
        const formatted = data.map((item, idx) => ({
          id: idx,
          category: item.category,
          amount: parseFloat(item.amt),
          date: new Date(item.date).toDateString(),
          mode: item.mode,
          description: item.description || 'No description'
        }));
        // Sort recent first
        formatted.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTransactions(formatted);
      })
      .catch(err => console.error("Error loading transactions:", err));
  }, [userId]);

  return (
    <div className="recents-container">
      <h2>Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="no-transactions">No recent transactions.</p>
      ) : (
        <ul className="transactions-list">
          {transactions.map(txn => (
            <li key={txn.id} className="transaction-card">
              <div className="card-header">
                <span className="category">{txn.category}</span>
                <span className="amount">₹{txn.amount.toFixed(2)}</span>
              </div>
              <div className="card-details">
                <span className="date">{txn.date}</span>
                <span className="mode">{txn.mode.toUpperCase()}</span>
              </div>
              <p className="description">{txn.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recents;
