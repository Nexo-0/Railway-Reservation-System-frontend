import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TrainList from './pages/TrainList.jsx';
import SearchResults from './pages/SearchResults.jsx';
import BookingCheckout from './pages/BookingCheckout.jsx';
import MyBookings from './pages/MyBookings.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManageTrains from './pages/ManageTrains.jsx';
import RevenueReport from './pages/RevenueReport.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trains" element={<TrainList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/checkout/:trainId" element={<BookingCheckout />} />
            <Route path="/bookings" element={<MyBookings />} />
          </Route>

          <Route element={<RoleRoute role="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/trains" element={<ManageTrains />} />
            <Route path="/admin/revenue" element={<RevenueReport />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
