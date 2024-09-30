import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './ExpenseForm.css';

const ExpenseForm: React.FC = () => {
  const [amount, setAmount] = useState<number | string>(''); 
  const [description, setDescription] = useState<string>(''); 
  const [currencyId, setCurrencyId] = useState<string>(''); 
  const [expenseCategoryId, setExpenseCategoryId] = useState<string>(''); 
  const [expenseDate, setExpenseDate] = useState<string>(''); 
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 

  useEffect(() => {
    fetchCurrencies();
    fetchCategories();
    if (id) {
      fetchExpense(id); 
    }
  }, [id]);

  const fetchExpense = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAmount(response.data.amount);
      setDescription(response.data.description);
      setCurrencyId(response.data.currency_id);
      setExpenseCategoryId(response.data.expense_category_id);
      setExpenseDate(new Date(response.data.expense_date).toISOString().substring(0, 10)); // Format date
    } catch (err) {
      setError('Failed to fetch expense.');
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/currencies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrencies(response.data);
    } catch (err) {
      setError('Failed to fetch currencies.');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/expense_categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch expense categories.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { 
        amount: Number(amount), // Ensure amount is a number
        description,
        currency_id: currencyId,
        expense_category_id: expenseCategoryId,
        expense_date: expenseDate,
      };
      if (id) {
        await axios.patch(`http://localhost:3000/api/expenses/${id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://localhost:3000/api/expenses', data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate('/expenses'); 
    } catch (err) {
      setError('Failed to submit expense.');
    }
  };

  return (
    <div className="expense-form-container">
      <h2>{id ? 'Edit Expense' : 'Add New Expense'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <select
            value={currencyId}
            onChange={(e) => setCurrencyId(e.target.value)}
            required
          >
            <option value="">Select Currency</option>
            {currencies.map((currency) => (
              <option key={currency.id} value={currency.id}>{currency.currency_code}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            value={expenseCategoryId}
            onChange={(e) => setExpenseCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;
