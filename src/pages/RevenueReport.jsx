import { useEffect, useState } from 'react';
import RevenueChart from '../components/RevenueChart.jsx';
import { fetchRevenue } from '../services/admin.js';

export default function RevenueReport() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRevenue = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRevenue();
      setRevenue(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load revenue data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRevenue(); }, []);

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-0">Revenue Report</h4>
          <p className="text-muted small mb-0">Confirmed bookings analytics</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={loadRevenue} disabled={loading}>
          {loading ? <span className="spinner-border spinner-border-sm" /> : '↻ Refresh'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">Loading revenue data...</p>
        </div>
      ) : (
        <RevenueChart revenue={revenue} />
      )}
    </div>
  );
}
