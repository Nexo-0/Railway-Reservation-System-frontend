import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchTrainById } from '../services/trains.js';
import { createBooking } from '../services/bookings.js';

export default function BookingCheckout() {
  const { trainId } = useParams();
  const navigate = useNavigate();
  const [train, setTrain] = useState(null);
  const [seats, setSeats] = useState(1);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchTrainById(trainId)
      .then((data) => { if (mounted) setTrain(data); })
      .catch(() => { if (mounted) setError('Unable to load train details. Please go back and try again.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [trainId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!train) return;
    setError(null);
    setBooking(true);
    try {
      const data = await createBooking({ trainNo: train.trainNo, seatsBooked: Number(seats) });
      setReceipt(data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
        <p className="text-muted mt-3">Loading train details...</p>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="alert alert-warning d-flex align-items-center gap-3">
        <span>🚫 {error || 'Train not found.'}</span>
        <Link to="/trains" className="btn btn-sm btn-outline-secondary ms-auto">Back to Trains</Link>
      </div>
    );
  }

  const total = (train.price * seats).toFixed(2);

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <Link to="/trains" className="btn btn-outline-secondary btn-sm">← Back</Link>
        <h4 className="mb-0">Booking Checkout</h4>
      </div>

      <div className="row g-4">
        {/* Train Info */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-1">{train.trainName}</h5>
            <span className="badge bg-primary mb-3">Train #{train.trainNo}</span>
            <div className="row g-2 text-sm">
              <div className="col-6">
                <div className="text-muted small">From</div>
                <div className="fw-semibold">{train.source}</div>
              </div>
              <div className="col-6">
                <div className="text-muted small">To</div>
                <div className="fw-semibold">{train.destination}</div>
              </div>
              <div className="col-6 mt-2">
                <div className="text-muted small">Departure</div>
                <div className="fw-semibold">{fmt(train.departureTime)}</div>
              </div>
              <div className="col-6 mt-2">
                <div className="text-muted small">Arrival</div>
                <div className="fw-semibold">{fmt(train.arrivalTime)}</div>
              </div>
              <div className="col-6 mt-2">
                <div className="text-muted small">Price per seat</div>
                <div className="fw-semibold text-success">₹{train.price}</div>
              </div>
              <div className="col-6 mt-2">
                <div className="text-muted small">Available Seats</div>
                <div className="fw-semibold">{train.seatsAvailable} / {train.totalSeats}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="mb-3">Book Seats</h5>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Number of Seats</label>
                <input
                  type="number"
                  className="form-control form-control-lg"
                  min={1}
                  max={Math.min(train.seatsAvailable, 10)}
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  required
                />
                <div className="form-text">Max 10 seats per booking.</div>
              </div>
              <div className="p-3 rounded-3 mb-3" style={{ background: '#f0f9ff' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Total Amount</span>
                  <strong className="text-primary fs-5">₹{total}</strong>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={booking || train.seatsAvailable === 0}
              >
                {booking ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {booking ? 'Processing...' : train.seatsAvailable === 0 ? 'Sold Out' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Booking Receipt Modal */}
      {receipt && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
        >
          <div className="card border-0 shadow-xl rounded-4 p-4" style={{ maxWidth: 420, width: '100%' }}>
            <div className="text-center mb-3">
              <div style={{ fontSize: 48 }}>🎉</div>
              <h5 className="fw-bold text-success">Booking Confirmed!</h5>
              <p className="text-muted small">Your seat(s) are reserved. Safe travels!</p>
            </div>
            <div className="list-group list-group-flush mb-4">
              <div className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Booking ID</span>
                <strong>#{receipt.bookingId}</strong>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Train</span>
                <strong>{receipt.trainName}</strong>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Seats Booked</span>
                <strong>{receipt.seatsBooked}</strong>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Total Paid</span>
                <strong className="text-success">₹{receipt.totalAmount}</strong>
              </div>
              <div className="list-group-item d-flex justify-content-between px-0">
                <span className="text-muted">Status</span>
                <span className="badge bg-success">{receipt.bookingStatus}</span>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-fill" onClick={() => navigate('/bookings')}>
                My Bookings
              </button>
              <button className="btn btn-outline-secondary flex-fill" onClick={() => { setReceipt(null); navigate('/trains'); }}>
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
