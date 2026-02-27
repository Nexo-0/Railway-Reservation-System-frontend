import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllBookings, fetchAllUsers, fetchRevenue } from '../services/admin.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, bookings: 0, confirmed: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchAllBookings(), fetchRevenue()])
      .then(([users, bookings, revenue]) => {
        const confirmedCount = Array.isArray(bookings)
          ? bookings.filter((b) => b.bookingStatus === 'CONFIRMED').length
          : 0;
        setStats({
          users: Array.isArray(users) ? users.length : 0,
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          confirmed: confirmedCount,
          revenue: revenue?.totalRevenue || 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: '👥', label: 'Total Users', value: stats.users, color: '#8b5cf6' },
    { icon: '🎫', label: 'Total Bookings', value: stats.bookings, color: '#3b82f6' },
    { icon: '✅', label: 'Confirmed', value: stats.confirmed, color: '#10b981' },
    { icon: '💰', label: 'Total Revenue', value: `₹${Number(stats.revenue).toLocaleString('en-IN')}`, color: '#f59e0b' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="rounded-4 p-5 text-white" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#7c3aed 100%)' }}>
        <h2 className="fw-bold mb-1">Admin Control Center</h2>
        <p className="opacity-75 mb-4">Monitor operations, manage trains, and view revenue insights.</p>
        <div className="d-flex flex-wrap gap-2">
          <Link className="btn btn-light fw-semibold px-4" to="/admin/trains">Manage Trains</Link>
          <Link className="btn btn-outline-light px-4" to="/admin/revenue">Revenue Report</Link>
        </div>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-3">
          {cards.map((c) => (
            <div key={c.label} className="col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
                <div style={{ fontSize: 32 }}>{c.icon}</div>
                <div className="text-muted small mt-2">{c.label}</div>
                <div className="fs-4 fw-bold mt-1" style={{ color: c.color }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Links */}
      <div className="row g-3">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-semibold mb-3">🚆 Train Management</h6>
            <p className="text-muted small">Add, update, or remove trains. Manage schedules and pricing.</p>
            <Link className="btn btn-primary btn-sm" to="/admin/trains">Go to Manage Trains →</Link>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h6 className="fw-semibold mb-3">📊 Revenue Reports</h6>
            <p className="text-muted small">View confirmed booking revenue and average ticket prices.</p>
            <Link className="btn btn-outline-primary btn-sm" to="/admin/revenue">View Revenue Report →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
