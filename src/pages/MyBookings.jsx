import { useEffect, useState } from 'react';
import BookingTable from '../components/BookingTable.jsx';
import { cancelBooking, fetchMyBookings } from '../services/bookings.js';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking? Seats will be restored.')) return;
    setCancelling(bookingId);
    try {
      await cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="mb-0 fw-bold">My Bookings</h4>
          <p className="text-muted small mb-0">Your complete travel history</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadBookings} disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" /> : '↻ Refresh'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card border-0 shadow-sm rounded-4 p-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="text-muted mt-3">Loading bookings...</p>
          </div>
        ) : (
          <BookingTable
            bookings={bookings}
            onCancel={handleCancel}
            cancelling={cancelling}
          />
        )}
      </div>
    </div>
  );
}
