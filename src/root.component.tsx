import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/expenses" element={<ExpenseList />} />
        <Route path="/expenses/new" element={<ExpenseForm />} />
        <Route path="/expenses/edit/:id" element={<ExpenseForm />} />
      </Routes>
    </Router>
  );
};

export default App;
