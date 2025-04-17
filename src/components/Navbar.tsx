import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tent, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Tent className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-800">Camp Explorer</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md">
              About Us
            </Link>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-md border border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <>
                <Link to="/login" className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/signup" className="text-green-600 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-md">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;