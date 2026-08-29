import { NavLink, useNavigate } from 'react-router-dom';
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
    <nav className="navbar">
      <span className="brand">Amass</span>
      <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
      <NavLink to="/transactions" className={({isActive}) => isActive ? 'active' : ''}>Transactions</NavLink>
      <NavLink to="/budgets" className={({isActive}) => isActive ? 'active' : ''}>Budgets</NavLink>
      <NavLink to="/goals" className={({isActive}) => isActive ? 'active' : ''}>Goals</NavLink>
      <NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>Reports</NavLink>
      <div className="spacer" />
      <div className="user">
        {user.name}
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}