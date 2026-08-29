import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import ConfirmDialog from '../components/ConfirmDialog';
import Spinner from '../components/Spinner';
import TiltCard from '../components/TiltCard';
import PageTransition from '../components/PageTransition';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_id: '', type: 'expense', amount: '', date: '', note: '' });
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const { showToast } = useToast();

  const loadTransactions = () => api.get('/transactions').then((res) => setTransactions(res.data));

  useEffect(() => {
    Promise.all([loadTransactions(), api.get('/categories').then((res) => setCategories(res.data))])
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/transactions', form);
      setForm({ category_id: '', type: 'expense', amount: '', date: '', note: '' });
      loadTransactions();
      showToast('Transaction added', 'success');
    } catch {
      showToast('Failed to add transaction', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/transactions/${confirmId}`);
      loadTransactions();
      showToast('Transaction deleted', 'success');
    } catch {
      showToast('Failed to delete', 'error');
    } finally {
      setConfirmId(null);
    }
  };

  if (loading) return <div className="page"><Spinner /></div>;

  return (
    <PageTransition>
      <div className="page">
        <h2>Transactions</h2>

        <TiltCard className="card" glow={false}>
          <form onSubmit={handleSubmit} className="form-row" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Category</option>
              {categories.filter(c => c.type === form.type).map((c) => (
                <option key={c.category_id} value={c.category_id}>{c.name}</option>
              ))}
            </select>
            <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required style={{ width: 110 }} />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            <input type="text" placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ flex: 1, minWidth: 140 }} />
            <button type="submit" className="btn">Add</button>
          </form>
        </TiltCard>

        <div style={{ height: '1.5rem' }} />

        {transactions.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-icon">◇</div>
            <p>No transactions yet</p>
            <span>Add your first one using the form above</span>
          </div>
        ) : (
          <TiltCard className="card" glow={false}>
            <div className="table-wrap">
              <table className="ledger">
                <thead>
                  <tr><th>Date</th><th>Type</th><th>Category</th><th>Note</th><th style={{textAlign:'right'}}>Amount</th><th></th></tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.transaction_id} className="row-enter">
                      <td className="mono">{t.date?.slice(0, 10)}</td>
                      <td style={{ textTransform: 'capitalize' }}>{t.type}</td>
                      <td>{t.category_name}</td>
                      <td style={{ color: 'var(--muted)' }}>{t.note}</td>
                      <td className={`amount ${t.type}`}>{t.type === 'expense' ? '-' : '+'}{t.amount}</td>
                      <td><button className="btn-outline" onClick={() => setConfirmId(t.transaction_id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TiltCard>
        )}

        <ConfirmDialog
          open={!!confirmId}
          title="Delete transaction?"
          message="This can't be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </PageTransition>
  );
}