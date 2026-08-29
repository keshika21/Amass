import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Spinner from '../components/Spinner';
import TiltCard from '../components/TiltCard';
import CountUp from '../components/CountUp';
import PageTransition from '../components/PageTransition';

const COLORS = ['#1F4D3D', '#C9A227', '#2F7A52', '#A8433A', '#6B6F63', '#8C6D2F', '#4A7A6D', '#B08A00'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/dashboard').then((res) => setSummary(res.data));
    api.get('/dashboard/chart').then((res) => setChartData(res.data));
    api.get('/transactions').then((res) => setRecent(res.data.slice(0, 5)));
  }, []);

  if (!summary) return <div className="page"><Spinner /></div>;

  return (
    <PageTransition>
      <div className="page">
        <h2>Dashboard</h2>

        <TiltCard className="passbook">
          <div className="passbook-label">Account Summary</div>
          <div className="passbook-rows">
            <div className="passbook-row">
              <span className="label">Total Income</span>
              <span className="value income mono"><CountUp value={summary.total_income} /></span>
            </div>
            <div className="passbook-row">
              <span className="label">Total Expense</span>
              <span className="value expense mono"><CountUp value={summary.total_expense} /></span>
            </div>
            <div className="passbook-row">
              <span className="label">Balance</span>
              <span className="value balance mono"><CountUp value={summary.balance} /></span>
            </div>
          </div>
        </TiltCard>

        <div className="dashboard-grid">
          <div>
            <h3>Spending by Category</h3>
            {chartData.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-icon">◐</div>
                <p>No expenses yet</p>
                <span>Log one from <Link to="/transactions">Transactions</Link></span>
              </div>
            ) : (
              <TiltCard className="card" glow={false}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <PieChart width={420} height={300}>
                    <Pie data={chartData} dataKey="total" nameKey="category" outerRadius={100} label>
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </TiltCard>
            )}
          </div>

          <div>
            <h3>Recent Activity</h3>
            {recent.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-icon">◇</div>
                <p>Nothing logged yet</p>
              </div>
            ) : (
              <TiltCard className="card recent-list" glow={false}>
                {recent.map((t) => (
                  <div key={t.transaction_id} className="recent-row">
                    <div>
                      <div className="recent-cat">{t.category_name}</div>
                      <div className="recent-date mono">{t.date?.slice(0, 10)}</div>
                    </div>
                    <div className={`amount mono ${t.type}`}>{t.type === 'expense' ? '-' : '+'}{t.amount}</div>
                  </div>
                ))}
              </TiltCard>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}