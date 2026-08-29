import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: '', target_amount: '', target_date: '' });

  const loadGoals = () => api.get('/goals').then((res) => setGoals(res.data));

  useEffect(() => { loadGoals(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/goals', form);
    setForm({ name: '', target_amount: '', target_date: '' });
    loadGoals();
  };

  const handleDelete = async (id) => {
    await api.delete(`/goals/${id}`);
    loadGoals();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Savings Goals</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input type="text" placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="number" placeholder="Target amount" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} required />
        <input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} required />
        <button type="submit">Add Goal</button>
      </form>

      {goals.map((g) => {
        const pct = Math.min(100, (g.current_amount / g.target_amount) * 100).toFixed(0);
        return (
          <div key={g.goal_id} style={{ marginBottom: 16, border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{g.name}</strong>
              <button onClick={() => handleDelete(g.goal_id)}>Delete</button>
            </div>
            <div>{g.current_amount} / {g.target_amount} (by {g.target_date?.slice(0, 10)})</div>
            <div style={{ background: '#eee', borderRadius: 4, height: 10, marginTop: 6 }}>
              <div style={{ width: `${pct}%`, background: '#4caf50', height: '100%', borderRadius: 4 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}