// Remove the unused React import if it exists
// import React from 'react'; // <--- REMOVE THIS LINE if present
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import {CamperDashboard} from './pages/CamperDashboard'; // Import should be fine

// Simple Loading Component (replace with a proper spinner)
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-lg font-medium text-gray-600">Loading App...</div>
    {/* You can add a spinner SVG or component here */}
  </div>
);

function App() {
  const { user, profile, loading } = useAuth();

  // Determine the dashboard route based on the fetched profile role
  const getDashboardRoute = () => {
    if (!profile) return '/'; // Should ideally not happen if loading state is handled
    return profile.role === 'admin' ? '/admin' : '/camper';
  };

  // Show loading indicator while initial auth check is running
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="pt-4 pb-8 px-4"> {/* Added padding */}
            <Routes>
              {/* Public Routes */}
              <Route path="/about" element={<About />} />

              {/* Routes for logged-out users */}
              <Route
                path="/"
                element={!user ? <WelcomePage /> : <Navigate to={getDashboardRoute()} replace />}
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to={getDashboardRoute()} replace />}
              />
              <Route
                path="/signup"
                element={!user ? <SignUp /> : <Navigate to={getDashboardRoute()} replace />}
              />

              {/* Protected Routes */}
              {/* Ensure the component is correctly referenced */}
              <Route
                path="/admin"
                element={user && profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/camper"
                element={user && profile?.role === 'camper' ? <CamperDashboard /> : <Navigate to="/login" replace />}
              />

              {/* Catch-all for unknown routes - redirect to appropriate place */}
               <Route path="*" element={<Navigate to={user ? getDashboardRoute() : "/"} replace />} />

            </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;