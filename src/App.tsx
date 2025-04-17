import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import WelcomePage from './pages/WelcomePage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import CamperDashboard from './pages/CamperDashboard';

function App() {
  const { user, profile } = useAuth();

  const getDashboardRoute = () => {
    if (!user || !profile) return '/';
    return profile.role === 'admin' ? '/admin' : '/camper';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
        <Navbar />
        <Routes>
          <Route path="/" element={user ? <Navigate to={getDashboardRoute()} /> : <WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/camper" element={<CamperDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;