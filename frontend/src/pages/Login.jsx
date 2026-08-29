import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h2>Login to Amass</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: 8, width: '100%' }}>Login</button>
      </form>
      <p>No account? <Link to="/register">Register here</Link></p>
    </div>
  );
}