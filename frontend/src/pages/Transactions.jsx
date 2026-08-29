import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_id: '', type: 'expense', amount: '', date: '', note: '' });

  const loadTransactions = () => {
    api.get('/transactions').then((res) => setTransactions(res.data));
  };

  useEffect(() => {
    loadTransactions();
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/transactions', form);
    setForm({ category_id: '', type: 'expense', amount: '', date: '', note: '' });
    loadTransactions();
  };

  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    loadTransactions();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Transactions</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
          <option value="">Select category</option>
          {categories.filter(c => c.type === form.type).map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
        </select>
        <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <input type="text" placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        <button type="submit">Add</button>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>Date</th><th>Type</th><th>Category</th><th>Amount</th><th>Note</th><th></th></tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.transaction_id}>
              <td>{t.date?.slice(0, 10)}</td>
              <td>{t.type}</td>
              <td>{t.category_name}</td>
              <td>{t.amount}</td>
              <td>{t.note}</td>
              <td><button onClick={() => handleDelete(t.transaction_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}