import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainCard from '../components/TrainCard.jsx';
import { fetchTrains, searchTrains } from '../services/trains.js';

export default function TrainList() {
  const navigate = useNavigate();
  const [trains, setTrains] = useState([]);
  const [filters, setFilters] = useState({ source: '', destination: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const loadTrains = async () => {
    setLoading(true);
    setError(null);
    setSearched(false);
    try {
      const data = await fetchTrains();
      setTrains(Array.isArray(data) ? data : []);
    } catch {
      setError('Failed to load trains. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrains(); }, []);

  const handleChange = (field) => (e) => setFilters((p) => ({ ...p, [field]: e.target.value }));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!filters.source.trim() || !filters.destination.trim()) {
      await loadTrains(); return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const data = await searchTrains(filters.source, filters.destination);
      setTrains(Array.isArray(data) ? data : []);
      navigate(`/search?source=${encodeURIComponent(filters.source)}&destination=${encodeURIComponent(filters.destination)}`);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <h4 className="fw-bold mb-0">Available Trains</h4>
        <p className="text-muted small">Find and book the perfect train for your journey</p>
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3">
        <form className="row g-2" onSubmit={handleSearch}>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="🔍 From (Source city)"
              value={filters.source}
              onChange={handleChange('source')}
            />
          </div>
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="📍 To (Destination city)"
              value={filters.destination}
              onChange={handleChange('destination')}
            />
          </div>
          <div className="col-md-4 d-flex gap-2">
            <button className="btn btn-primary flex-fill" type="submit" disabled={loading}>
              Search
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => { setFilters({ source: '', destination: '' }); loadTrains(); }}
              title="Reset"
            >
              ×
            </button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-3">Loading trains...</p>
        </div>
      ) : trains.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: 52 }}>🚉</div>
          <h5 className="mt-3">{searched ? 'No trains match your search' : 'No trains available'}</h5>
          <p className="text-muted small">{searched ? 'Try different cities or clear search.' : 'Check back soon!'}</p>
          {searched && <button className="btn btn-outline-primary btn-sm" onClick={loadTrains}>View All Trains</button>}
        </div>
      ) : (
        <>
          <p className="text-muted small mb-0">{trains.length} train{trains.length !== 1 ? 's' : ''} found</p>
          <div className="row g-3">
            {trains.map((train) => (
              <div key={train.trainNo} className="col-md-4 col-sm-6">
                <TrainCard train={train} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
