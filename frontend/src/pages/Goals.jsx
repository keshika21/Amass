import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({ name: '', target_amount: '', target_date: '' });
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const { showToast } = useToast();

  const loadGoals = () => api.get('/goals').then((res) => setGoals(res.data));

  useEffect(() => { loadGoals().finally(() => setLoading(false)); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/goals', form);
      setForm({ name: '', target_amount: '', target_date: '' });
      loadGoals();
      showToast('Goal created', 'success');
    } catch {
      showToast('Failed to create goal', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/goals/${confirmId}`);
      loadGoals();
      showToast('Goal deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  if (loading) return <div className="page"><Spinner /></div>;

  return (
    <div className="page fade-in">
      <h2>Savings Goals</h2>

      <form onSubmit={handleSubmit} className="form-row">
        <input type="text" placeholder="Goal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ flex: 1, minWidth: 140 }} />
        <input type="number" placeholder="Target amount" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} required style={{ width: 130 }} />
        <input type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} required />
        <button type="submit" className="btn">Add Goal</button>
      </form>

      {goals.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-icon">◈</div>
          <p>No savings goals yet</p>
          <span>Set your first target above</span>
        </div>
      ) : goals.map((g) => {
        const pct = Math.min(100, (g.current_amount / g.target_amount) * 100).toFixed(0);
        return (
          <div key={g.goal_id} className="goal-card tilt-card row-enter">
            <div className="goal-header">
              <strong>{g.name}</strong>
              <button className="btn-outline" onClick={() => setConfirmId(g.goal_id)}>Delete</button>
            </div>
            <div className="goal-amounts">{g.current_amount} / {g.target_amount} &middot; by {g.target_date?.slice(0, 10)}</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete goal?"
        message="This can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}