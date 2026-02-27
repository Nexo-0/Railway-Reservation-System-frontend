import { Link } from 'react-router-dom';

const fmt = (dt) =>
  dt ? new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function TrainCard({ train }) {
  const pct = train.totalSeats > 0 ? Math.round((train.seatsAvailable / train.totalSeats) * 100) : 0;
  const barColor = pct > 50 ? 'bg-success' : pct > 20 ? 'bg-warning' : 'bg-danger';

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold mb-0">{train.trainName}</h6>
            <span className="badge text-bg-secondary">#{train.trainNo}</span>
          </div>
          <span className="fs-5 fw-bold text-primary">₹{train.price}</span>
        </div>

        <div className="d-flex align-items-center gap-2 text-muted mb-3">
          <span>{train.source}</span>
          <span>→</span>
          <span>{train.destination}</span>
        </div>

        <div className="small text-muted mb-1">🕐 Dep: {fmt(train.departureTime)}</div>
        <div className="small text-muted mb-3">🕑 Arr: {fmt(train.arrivalTime)}</div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Available Seats</span>
            <span className={`fw-semibold ${pct < 20 ? 'text-danger' : 'text-success'}`}>
              {train.seatsAvailable} / {train.totalSeats}
            </span>
          </div>
          <div className="progress mb-3" style={{ height: 6 }}>
            <div className={`progress-bar ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
          {train.seatsAvailable > 0 ? (
            <Link className="btn btn-primary w-100" to={`/checkout/${train.trainNo}`}>
              Book Now
            </Link>
          ) : (
            <button className="btn btn-outline-secondary w-100" disabled>Sold Out</button>
          )}
        </div>
      </div>
    </div>
  );
}
