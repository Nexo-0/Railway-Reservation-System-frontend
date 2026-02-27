import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function RoleRoute({ role }) {
  const { token, user } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (!user || user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
