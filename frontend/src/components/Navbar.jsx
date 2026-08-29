import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/transactions">Transactions</Link>
      <Link to="/budgets">Budgets</Link>
      <Link to="/goals">Goals</Link>
      <span style={{ marginLeft: 'auto' }}>
        {user.name} <button onClick={handleLogout}>Logout</button>
      </span>
    </nav>
  );
}