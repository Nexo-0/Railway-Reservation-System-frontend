export default function BookingTable({ bookings, onCancel }) {
  const fmt = (dt) =>
    dt ? new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  if (!bookings || bookings.length === 0) {
    return (
      <div className="text-center py-5">
        <div style={{ fontSize: 52 }}>🎫</div>
        <h6 className="mt-3 text-muted">No bookings yet</h6>
        <p className="text-muted small">Once you book a train, your tickets will appear here.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>#ID</th>
            <th>Train</th>
            <th>Seats</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.bookingId}>
              <td className="text-muted small">#{b.bookingId}</td>
              <td className="fw-semibold">{b.trainName || '—'}</td>
              <td>{b.seatsBooked}</td>
              <td className="fw-semibold text-success">₹{b.totalAmount}</td>
              <td>
                <span className={`badge ${b.bookingStatus === 'CONFIRMED' ? 'bg-success' : 'bg-secondary'}`}>
                  {b.bookingStatus}
                </span>
              </td>
              <td className="small text-muted">{fmt(b.bookingDate)}</td>
              <td>
                {b.bookingStatus === 'CONFIRMED' && (
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onCancel(b.bookingId)}
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
