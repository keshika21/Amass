import { useEffect, useState } from 'react';
import api from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#1F4D3D', '#C9A227', '#2F7A52', '#A8433A', '#6B6F63', '#8C6D2F', '#4A7A6D', '#B08A00'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get('/dashboard').then((res) => setSummary(res.data));
    api.get('/dashboard/chart').then((res) => setChartData(res.data));
  }, []);

  if (!summary) return <div className="page"><p className="empty-state">Loading...</p></div>;

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <div className="passbook">
        <div className="passbook-label">Account Summary</div>
        <div className="passbook-rows">
          <div className="passbook-row">
            <span className="label">Total Income</span>
            <span className="value income">{summary.total_income}</span>
          </div>
          <div className="passbook-row">
            <span className="label">Total Expense</span>
            <span className="value expense">{summary.total_expense}</span>
          </div>
          <div className="passbook-row">
            <span className="label">Balance</span>
            <span className="value balance">{summary.balance}</span>
          </div>
        </div>
      </div>

      <h3>Spending by Category</h3>
      {chartData.length === 0 ? (
        <p className="empty-state">No expenses logged yet — add one from the Transactions page.</p>
      ) : (
        <div className="card" style={{ display: 'flex', justifyContent: 'center' }}>
          <PieChart width={480} height={300}>
            <Pie data={chartData} dataKey="total" nameKey="category" outerRadius={100} label>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
}