import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <div style={{ fontSize: 80 }}>🚉</div>
      <h2 className="fw-bold mt-3">404 — Page Not Found</h2>
      <p className="text-muted mb-4">Looks like this train left without you. The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="btn btn-primary px-5">Back to Dashboard</Link>
    </div>
  );
}
