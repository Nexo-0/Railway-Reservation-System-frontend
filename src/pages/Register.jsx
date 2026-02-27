import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register({ username: form.username, password: form.password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="text-center mb-4">
              <h2 className="text-white fw-bold">🚂 RailwayX</h2>
              <p className="text-white-50">Create your account</p>
            </div>
            <div className="card shadow-lg border-0 rounded-4 p-4">
              {error && <div className="alert alert-danger py-2">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    className="form-control form-control-lg"
                    placeholder="Choose a username"
                    value={form.username}
                    onChange={handleChange('username')}
                    required minLength={3} maxLength={50}
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange('password')}
                    required minLength={6}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Repeat password"
                    value={form.confirm}
                    onChange={handleChange('confirm')}
                    required
                  />
                </div>
                <button className="btn btn-success btn-lg w-100" disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
              <p className="text-center mt-3 mb-0 text-muted small">
                Already registered? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
