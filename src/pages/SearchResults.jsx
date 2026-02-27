import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import TrainCard from '../components/TrainCard.jsx';
import { searchTrains } from '../services/trains.js';

export default function SearchResults() {
  const [params] = useSearchParams();
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const source = params.get('source') || '';
  const destination = params.get('destination') || '';

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    searchTrains(source, destination)
      .then((data) => { if (mounted) setTrains(Array.isArray(data) ? data : []); })
      .catch(() => { if (mounted) setError('Could not fetch results. Try again.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [source, destination]);

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/trains" className="btn btn-outline-secondary btn-sm">← Back</Link>
        <div>
          <h4 className="mb-0">Search Results</h4>
          <div className="text-muted small">{source} → {destination}</div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">Searching trains...</p>
        </div>
      ) : trains.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: 56 }}>🔍</div>
          <h5 className="mt-3">No trains found</h5>
          <p className="text-muted">Try different source/destination or check back later.</p>
          <Link to="/trains" className="btn btn-primary">View All Trains</Link>
        </div>
      ) : (
        <>
          <p className="text-muted mb-3">{trains.length} train{trains.length > 1 ? 's' : ''} found</p>
          <div className="row g-3">
            {trains.map((train) => (
              <div key={train.trainNo} className="col-md-4">
                <TrainCard train={train} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
