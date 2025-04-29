import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import About from './pages/About';
// Use named imports for dashboards
import { AdminDashboard } from './pages/AdminDashboard';
import { CamperDashboard } from './pages/CamperDashboard';

// Simple Loading Component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-lg font-medium text-gray-600">Loading App...</div>
  </div>
);

function App() {
  const { user, profile, loading } = useAuth();

  const getDashboardRoute = () => {
    if (!profile) return '/'; // Fallback if profile is null after loading
    return profile.role === 'admin' ? '/admin' : '/camper';
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="pt-4 pb-8 px-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/about" element={<About />} />

              {/* Routes for logged-out users */}
              <Route path="/" element={!user ? <WelcomePage /> : <Navigate to={getDashboardRoute()} replace />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to={getDashboardRoute()} replace />} />
              <Route path="/signup" element={!user ? <SignUp /> : <Navigate to={getDashboardRoute()} replace />} />

              {/* Protected Routes */}
              <Route
                path="/admin"
                element={user && profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/camper"
                element={user && profile?.role === 'camper' ? <CamperDashboard /> : <Navigate to="/login" replace />}
              />

              {/* Catch-all */}
               <Route path="*" element={<Navigate to={user ? getDashboardRoute() : "/"} replace />} />
            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;