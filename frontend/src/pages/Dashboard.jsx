import { useEffect, useState } from 'react';
import api from '../api/axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BF9', '#F94144', '#43AA8B', '#577590'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
  api.get('/dashboard').then((res) => setSummary(res.data));
  api.get('/dashboard/chart').then((res) => {
    const parsed = res.data.map((d) => ({ ...d, total: Number(d.total) }));
    setChartData(parsed);
  });
}, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div><strong>Total Income:</strong> {summary.total_income}</div>
        <div><strong>Total Expense:</strong> {summary.total_expense}</div>
        <div><strong>Balance:</strong> {summary.balance}</div>
      </div>

      {chartData.length > 0 && (
        <PieChart width={500} height={300}>
          <Pie data={chartData} dataKey="total" nameKey="category" outerRadius={100} label>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </div>
  );
}