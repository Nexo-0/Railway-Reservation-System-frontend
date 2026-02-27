export default function BookingForm({ train, seats, onChange, onSubmit }) {
  const total = train ? (Number(train.price) * Number(seats)).toFixed(2) : '0.00';
  return (
    <div className="card border-0 shadow-sm rounded-4 p-4">
      <h5 className="fw-bold mb-3">Select Seats</h5>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Number of Seats</label>
          <input
            type="number"
            className="form-control form-control-lg"
            min={1}
            max={Math.min(train?.seatsAvailable || 1, 10)}
            value={seats}
            onChange={(e) => onChange(Number(e.target.value))}
            required
          />
          <div className="form-text">{train?.seatsAvailable} seats left · Max 10 per booking</div>
        </div>
        <div className="d-flex justify-content-between align-items-center p-3 rounded-3 mb-3" style={{ background: '#f0fdf4' }}>
          <span className="text-muted">Total</span>
          <strong className="fs-5 text-success">₹{total}</strong>
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
