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
    <div style={{ padding: '2rem' }}>
      <h2>Budgets</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
        </select>
        <input type="number" placeholder="Month (1-12)" min="1" max="12" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} required />
        <input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} required />
        <input type="number" placeholder="Limit amount" value={form.limit_amount} onChange={(e) => setForm({ ...form, limit_amount: e.target.value })} required />
        <button type="submit">Set Budget</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Category</th><th>Month/Year</th><th>Limit</th><th>Spent</th><th>Remaining</th></tr>
        </thead>
        <tbody>
          {budgets.map((b) => (
            <tr key={b.budget_id}>
              <td>{b.category_name}</td>
              <td>{b.month}/{b.year}</td>
              <td>{b.limit_amount}</td>
              <td>{b.spent}</td>
              <td style={{ color: b.spent > b.limit_amount ? 'red' : 'green' }}>
                {(b.limit_amount - b.spent).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}