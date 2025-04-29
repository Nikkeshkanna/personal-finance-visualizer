'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const categories = ['Food', 'Transport', 'Health', 'Entertainment', 'Others'];

export default function Home() {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load transactions from localStorage on first render
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  // Handle form submission to add new transaction
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTransaction = { amount, date, description, category };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

    // Reset form fields
    setAmount('');
    setDate('');
    setDescription('');
    setCategory('');
  };

  // Handle delete all transactions
  const handleDelete = () => {
    setTransactions([]);
    localStorage.removeItem('transactions');
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total spending
  const totalSpent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);

  // Prepare data for monthly expenditure bar chart
  const monthlyExpenses = [];
  for (let i = 1; i <= 12; i++) {
    const monthTransactions = transactions.filter((transaction) => new Date(transaction.date).getMonth() + 1 === i);
    const totalMonthExpenses = monthTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    monthlyExpenses.push({ month: `Month ${i}`, expenditure: totalMonthExpenses });
  }

  // Prepare data for category-wise expenditure pie chart
  const categoryExpenses = categories.map((category) => {
    const totalCategoryExpenses = transactions
      .filter((transaction) => transaction.category === category)
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    return { name: category, value: totalCategoryExpenses };
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f8ff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 0 15px rgba(0,0,0,0.2)', width: '100%', maxWidth: '500px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#0070f3' }}>Personal Finance Visualizer</h1>

        {/* Transaction Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            marginTop: '10px',
            cursor: 'pointer'
          }}>
            Add Transaction
          </button>
        </form>

        {/* Delete All Transactions Button */}
        <button onClick={handleDelete} style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#ff4d4d',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          marginTop: '20px',
          cursor: 'pointer'
        }}>
          Delete All Transactions
        </button>

        {/* Search Bar */}
        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Search by Description or Category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* Transaction List */}
        <h2 style={{ marginTop: '20px', textAlign: 'center', color: '#333' }}>Transaction History</h2>
        <p style={{ textAlign: 'center', fontWeight: 'bold', color: 'green' }}>Total Spent: ₹{totalSpent}</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTransactions.map((transaction, index) => (
            <li key={index} style={{
              backgroundColor: '#e6f7ff',
              padding: '10px',
              marginTop: '10px',
              borderRadius: '5px'
            }}>
              ₹{transaction.amount} - {transaction.date} - {transaction.description} ({transaction.category})
            </li>
          ))}
        </ul>

        {/* Monthly Expenditure Bar Chart */}
        {monthlyExpenses.length > 0 && (
          <>
            <h3 style={{ textAlign: 'center' }}>Monthly Expenditure</h3>
            <BarChart width={500} height={300} data={monthlyExpenses} style={{ marginTop: '20px' }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="expenditure" fill="#8884d8" />
            </BarChart>
          </>
        )}

        {/* Category-wise Expenditure Pie Chart */}
        {categoryExpenses.some((category) => category.value > 0) && (
          <>
            <h3 style={{ textAlign: 'center', marginTop: '20px' }}>Category-wise Expenditure</h3>
            <PieChart width={400} height={400} style={{ marginTop: '20px' }}>
              <Pie
                data={categoryExpenses}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#82ca9d"
                label
              >
                {categoryExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.name === 'Food' ? '#ff7300' : '#0088FE'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </>
        )}
      </div>
    </div>
  );
}
