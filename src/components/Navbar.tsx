import { Link, useNavigate } from 'react-router-dom';
import { Tent, LogOut, User, Settings, Home } from 'lucide-react'; // Removed Shield
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const getDashboardPath = () => {
      if (!profile) return '/';
      return profile.role === 'admin' ? '/admin' : '/camper';
  };

  // Loading Skeleton/Placeholder
  if (loading) {
      return (
         <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                     <div className="flex items-center space-x-2 text-gray-400 animate-pulse">
                         <Tent className="h-8 w-8" />
                         <span className="text-xl font-bold h-6 bg-gray-300 rounded w-32"></span>
                     </div>
                     <div className="flex items-center space-x-4">
                        <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
                        <div className="h-8 bg-gray-300 rounded w-24 animate-pulse"></div>
                     </div>
                </div>
            </div>
         </nav>
      );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={user && profile ? getDashboardPath() : "/"} className="flex items-center space-x-2 group">
              <Tent className="h-8 w-8 text-green-600 group-hover:text-green-700 transition duration-150 ease-in-out" />
              <span className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition duration-150 ease-in-out">Camp Explorer</span>
            </Link>
          </div>

          {/* Links and Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
              About Us
            </Link>

            {user && profile ? (
              <>
                <Link
                    to={getDashboardPath()}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                    title="Dashboard" // Added title for accessibility
                >
                   {profile.role === 'admin' ? <Settings className="h-4 w-4"/> : <Home className="h-4 w-4"/>}
                   <span className="hidden sm:inline">Dashboard</span> {/* Hide text on small screens */}
                </Link>

                 {/* Example Profile Link/Indicator */}
                 {/* Use a dropdown or dedicated profile page */}
                 <span className="flex items-center space-x-1 text-gray-600 px-3 py-2 rounded-md text-sm font-medium">
                     <User className="h-4 w-4" />
                     {/* Display first name or email */}
                     <span>{profile.fullName?.split(' ')[0] || profile.email}</span>
                 </span>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-md border border-red-500 hover:border-red-600 transition duration-150 ease-in-out text-sm font-medium"
                  title="Sign Out" // Added title
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span> {/* Hide text on small screens */}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm hover:shadow">
                  Login
                </Link>
                <Link to="/signup" className="text-green-600 border border-green-600 hover:bg-green-50 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
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