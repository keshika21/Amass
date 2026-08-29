import { useState } from 'react';
import api from '../api/axios';

export default function Reports() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    setError('');
    try {
      const res = await api.get(`/reports/monthly?month=${month}&year=${year}`);
      setReport(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load report');
    }
  };

  return (
    <div className="page">
      <h2>Monthly Report</h2>

      <div className="form-row">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 100 }} />
        <button onClick={fetchReport} className="btn">Generate Report</button>
      </div>

      {error && <p className="error">{error}</p>}

      {report && (
        <div>
          <div className="passbook">
            <div className="passbook-label">{month}/{year}</div>
            <div className="passbook-rows">
              <div className="passbook-row"><span className="label">Total Income</span><span className="value income">{report.total_income}</span></div>
              <div className="passbook-row"><span className="label">Total Expense</span><span className="value expense">{report.total_expense}</span></div>
              <div className="passbook-row"><span className="label">Net Savings</span><span className="value balance">{(report.total_income - report.total_expense).toFixed(2)}</span></div>
            </div>
          </div>

          <h3>Spending by Category</h3>
          {report.by_category.length === 0 ? (
            <p className="empty-state">No expenses recorded for this period.</p>
          ) : (
            <table className="ledger">
              <thead><tr><th>Category</th><th style={{textAlign:'right'}}>Amount</th></tr></thead>
              <tbody>
                {report.by_category.map((c) => (
                  <tr key={c.category}><td>{c.category}</td><td className="amount mono expense">{c.total}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}