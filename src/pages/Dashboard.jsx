import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { fetchTrains } from '../services/trains.js';
import { fetchMyBookings } from '../services/bookings.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ trains: 0, myBookings: 0, confirmed: 0 });

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchTrains().catch(() => []),
      fetchMyBookings().catch(() => []),
    ]).then(([trains, bookings]) => {
      if (!mounted) return;
      const confirmed = Array.isArray(bookings)
        ? bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length
        : 0;
      setStats({
        trains: Array.isArray(trains) ? trains.length : 0,
        myBookings: Array.isArray(bookings) ? bookings.length : 0,
        confirmed,
      });
    });
    return () => { mounted = false; };
  }, []);

  const cards = [
    { icon: '🚆', label: 'Available Trains', value: stats.trains, color: '#3b82f6', link: '/trains', btn: 'Browse Trains' },
    { icon: '🎫', label: 'My Bookings', value: stats.myBookings, color: '#10b981', link: '/bookings', btn: 'View Bookings' },
    { icon: '✅', label: 'Confirmed', value: stats.confirmed, color: '#f59e0b', link: '/bookings', btn: 'See Details' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Hero */}
      <div className="rounded-4 p-5 text-white" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e40af 100%)' }}>
        <h2 className="fw-bold mb-1">Welcome back, {user?.username} 👋</h2>
        <p className="mb-4 opacity-75">Ready for your next journey? Browse trains and book in seconds.</p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-light fw-semibold px-4" to="/trains">🔍 Search Trains</Link>
          <Link className="btn btn-outline-light px-4" to="/bookings">My Bookings</Link>
          {user?.role === 'ADMIN' && (
            <Link className="btn btn-warning px-4" to="/admin">Admin Panel</Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3">
        {cards.map((c) => (
          <div key={c.label} className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: c.color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
                }}>{c.icon}</div>
                <div>
                  <div className="text-muted small">{c.label}</div>
                  <div className="fs-4 fw-bold" style={{ color: c.color }}>{c.value}</div>
                </div>
              </div>
              <Link className="btn btn-sm btn-outline-secondary mt-auto" to={c.link}>{c.btn} →</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tip */}
      <div className="alert alert-info border-0 rounded-4 mb-0" role="alert">
        💡 <strong>Tip:</strong> Book early to secure the best seat availability. Cancellations are free before departure.
      </div>
    </div>
  );
}
