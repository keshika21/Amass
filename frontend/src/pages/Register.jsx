import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '4rem auto' }}>
      <h2>Create your Amass account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: 8, width: '100%' }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
}