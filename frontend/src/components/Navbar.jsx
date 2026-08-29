import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const links = (
    <>
      <NavLink to="/dashboard" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
      <NavLink to="/transactions" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Transactions</NavLink>
      <NavLink to="/budgets" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Budgets</NavLink>
      <NavLink to="/goals" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Goals</NavLink>
      <NavLink to="/reports" onClick={() => setOpen(false)} className={({isActive}) => isActive ? 'active' : ''}>Reports</NavLink>
    </>
  );

  return (
    <nav className="navbar">
      <span className="brand">Amass</span>
      <div className="navbar-links desktop-only">{links}</div>
      <div className="spacer" />
      <div className="user desktop-only">
        {user.name}
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
      <button className="hamburger mobile-only" onClick={() => setOpen(!open)} aria-label="Menu">
        <span /><span /><span />
      </button>
      {open && (
        <div className="mobile-menu">
          {links}
          <div className="mobile-menu-footer">
            <span>{user.name}</span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}