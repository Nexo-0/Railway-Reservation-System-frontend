export default function RevenueChart({ revenue }) {
  const total = Number(revenue?.totalRevenue || 0);
  const bookings = Number(revenue?.totalBookings || 0);
  const avg = bookings > 0 ? (total / bookings).toFixed(2) : '0.00';

  const stats = [
    { label: 'Total Revenue', value: `₹${total.toLocaleString('en-IN')}`, color: '#10b981', icon: '💰' },
    { label: 'Confirmed Bookings', value: bookings, color: '#3b82f6', icon: '🎫' },
    { label: 'Avg Ticket Value', value: `₹${avg}`, color: '#f59e0b', icon: '📊' },
  ];

  return (
    <div>
      <div className="row g-3 mb-4">
        {stats.map((s) => (
          <div key={s.label} className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  width: 52, height: 52, borderRadius: 14, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: s.color + '20', fontSize: 24
                }}>{s.icon}</div>
                <div>
                  <div className="text-muted small">{s.label}</div>
                  <div className="fs-5 fw-bold" style={{ color: s.color }}>{s.value}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual bar chart */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h6 className="fw-semibold mb-3">Revenue Overview</h6>
        {bookings === 0 ? (
          <div className="text-muted text-center py-4">No confirmed bookings yet to visualize.</div>
        ) : (
          <div>
            <div className="d-flex align-items-center gap-3 mb-2">
              <div style={{ width: 120 }} className="text-muted small">Revenue</div>
              <div className="flex-fill">
                <div className="progress" style={{ height: 28, borderRadius: 8 }}>
                  <div className="progress-bar bg-success" style={{ width: '100%', borderRadius: 8 }}>
                    ₹{total.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 120 }} className="text-muted small">Avg Ticket</div>
              <div className="flex-fill">
                <div className="progress" style={{ height: 28, borderRadius: 8 }}>
                  <div className="progress-bar bg-warning text-dark"
                    style={{ width: total > 0 ? `${Math.min(100, (Number(avg) / (total / bookings)) * 100)}%` : '0%', borderRadius: 8 }}>
                    ₹{avg}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
