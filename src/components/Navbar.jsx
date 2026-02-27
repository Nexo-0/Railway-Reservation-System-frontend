import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#0f172a' }}>
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">RailwayX</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navLinks">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navLinks">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/trains">Trains</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/bookings">My Bookings</NavLink>
                </li>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin">Admin</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/trains">Manage Trains</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/revenue">Revenue</NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {token ? (
              <>
                <span className="text-light small">{user?.username || 'User'}</span>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                <Link className="btn btn-warning btn-sm" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
