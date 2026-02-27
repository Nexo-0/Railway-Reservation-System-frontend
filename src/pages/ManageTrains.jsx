import { useEffect, useState } from 'react';
import AdminTrainForm from '../components/AdminTrainForm.jsx';
import { createTrain, deleteTrain, fetchTrains, updateTrain } from '../services/trains.js';

export default function ManageTrains() {
  const [trains, setTrains] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const loadTrains = async () => {
    setLoading(true);
    try {
      const data = await fetchTrains();
      setTrains(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrains(); }, []);

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        await updateTrain(editing.trainNo, payload);
        setEditing(null);
      } else {
        await createTrain(payload);
      }
      setShowForm(false);
      await loadTrains();
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Failed to save train.');
    }
  };

  const handleEdit = (train) => {
    setEditing(train);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (trainNo, trainName) => {
    if (!window.confirm(`Delete "${trainName}"? This cannot be undone.`)) return;
    try {
      await deleteTrain(trainNo);
      await loadTrains();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete train.');
    }
  };

  const handleCancel = () => { setEditing(null); setShowForm(false); };

  const fmt = (dt) => dt ? new Date(dt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—';

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-0">Manage Trains</h4>
          <p className="text-muted small mb-0">Add, edit, or remove trains from the system</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={loadTrains} disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : '↻'}
          </button>
          {!showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => { setEditing(null); setShowForm(true); }}>
              + Add Train
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <AdminTrainForm initial={editing} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}

      {/* Table */}
      <div className="card border-0 shadow-sm rounded-4 p-3">
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
        ) : trains.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: 52 }}>🚆</div>
            <h6 className="mt-3 text-muted">No trains in the system</h6>
            <button className="btn btn-primary btn-sm mt-2" onClick={() => setShowForm(true)}>Add First Train</button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th><th>Name</th><th>Route</th><th>Departure</th><th>Price</th><th>Seats</th><th></th>
                </tr>
              </thead>
              <tbody>
                {trains.map((t) => (
                  <tr key={t.trainNo}>
                    <td className="text-muted small">#{t.trainNo}</td>
                    <td className="fw-semibold">{t.trainName}</td>
                    <td className="text-muted">{t.source} → {t.destination}</td>
                    <td className="small">{fmt(t.departureTime)}</td>
                    <td className="fw-semibold text-success">₹{t.price}</td>
                    <td>
                      <span className={`badge ${t.seatsAvailable > 20 ? 'bg-success' : t.seatsAvailable > 0 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {t.seatsAvailable}/{t.totalSeats}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(t)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t.trainNo, t.trainName)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
