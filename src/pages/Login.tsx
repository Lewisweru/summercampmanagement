import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, loading: authLoading, user } = useAuth(); // Get loading state and user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false); // Separate loading state for submission

  // Redirect if user is already logged in
  useEffect(() => {
      if (user) {
          navigate('/'); // Redirect to appropriate dashboard via App.tsx logic
      }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSubmitLoading(true);

    try {
      await signIn(email, password);
      // Navigation will be handled by App.tsx after AuthContext updates
      // navigate('/'); // Remove direct navigation
      console.log('Login successful, redirecting...');
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Failed to sign in. Check email and password.';
       if (err.code) {
            switch (err.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This user account has been disabled.';
                    break;
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential': // Catch newer Firebase error code
                    errorMessage = 'Invalid email or password.';
                    break;
                case 'auth/too-many-requests':
                     errorMessage = 'Too many login attempts. Please try again later or reset your password.';
                     break;
                // Add more specific Firebase error codes as needed
                default:
                    errorMessage = err.message || errorMessage;
            }
        }
      setError(errorMessage);
      setSubmitLoading(false); // Stop loading on error
    }
    // No need for finally block if setting loading false within try/catch
  };

  // Prevent rendering form if initial auth check is happening
  if (authLoading) {
      return <div>Loading...</div>; // Or a proper spinner
  }


  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>
        {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={submitLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                 disabled={submitLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Remember me functionality requires specific implementation (e.g., Firebase persistence) */}
              {/* <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label> */}
            </div>

            <div className="text-sm">
              {/* Add Forgot Password link if functionality exists */}
              {/* <Link to="/forgot-password" className="text-green-600 hover:text-green-500">
                Forgot your password?
              </Link> */}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading || authLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {submitLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;