import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ExpenseList.css'; 

const ExpenseList: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/expenses', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenses(response.data);
    } catch (err) {
      setError('Failed to fetch expenses.');
    }
  };

  return (
    <div className="expense-container">
      <h2>Expense Management</h2>
      {error && <p className="error">{error}</p>}
      <Link to="/expenses/new" className="btn btn-primary">Add New Expense</Link>
      <table className="expense-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Currency</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.id}</td>
              <td>{expense.amount}</td>
              <td>{expense.description}</td>
              <td>{expense.currency_id}</td>
              <td>{expense.expense_category_id}</td>
              <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
              <td>
                <Link to={`/expenses/edit/${expense.id}`} className="btn btn-warning">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseList;
