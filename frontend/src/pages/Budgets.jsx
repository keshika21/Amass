import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_id: '', month: new Date().getMonth() + 1, year: new Date().getFullYear(), limit_amount: '' });
  const [error, setError] = useState('');

  const loadBudgets = () => api.get('/budgets').then((res) => setBudgets(res.data));

  useEffect(() => {
    loadBudgets();
    api.get('/categories').then((res) => setCategories(res.data.filter(c => c.type === 'expense')));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/budgets', form);
      setForm({ ...form, category_id: '', limit_amount: '' });
      loadBudgets();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create budget');
    }
  };

  return (
    <div className="page">
      <h2>Budgets</h2>

      <form onSubmit={handleSubmit} className="form-row">
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
          <option value="">Category</option>
          {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Month" min="1" max="12" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required style={{ width: 90 }} />
        <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required style={{ width: 100 }} />
        <input type="number" placeholder="Limit" value={form.limit_amount} onChange={(e) => setForm({ ...form, limit_amount: e.target.value })} required style={{ width: 110 }} />
        <button type="submit" className="btn">Set Budget</button>
      </form>
      {error && <p className="error" style={{marginTop: -12, marginBottom: 16}}>{error}</p>}

      {budgets.length === 0 ? (
        <p className="empty-state">No budgets set yet.</p>
      ) : (
        <table className="ledger">
          <thead>
            <tr><th>Category</th><th>Period</th><th style={{textAlign:'right'}}>Limit</th><th style={{textAlign:'right'}}>Spent</th><th style={{textAlign:'right'}}>Remaining</th></tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b.budget_id}>
                <td>{b.category_name}</td>
                <td className="mono">{b.month}/{b.year}</td>
                <td className="amount mono">{b.limit_amount}</td>
                <td className="amount mono">{b.spent}</td>
                <td className={`amount mono ${b.spent > b.limit_amount ? 'expense' : 'income'}`}>
                  {(b.limit_amount - b.spent).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}