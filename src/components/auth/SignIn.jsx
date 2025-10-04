import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // TEMPORARY: Simulate API call - REPLACE with real backend later
    setTimeout(() => {
      if (formData.email === 'test@test.com' && formData.password === 'password') {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Test User', email: formData.email }));
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Use: test@test.com / password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign In</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-button">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <div className="demo-credentials">
          <p><strong>Demo:</strong> test@test.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
