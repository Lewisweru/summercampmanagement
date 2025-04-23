import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Role = 'camper' | 'admin'; // Define Role type

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp, loading: authLoading, user } = useAuth(); // Get loading state and user from context
  const [role, setRole] = useState<Role>('camper'); // Use Role type
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false); // Separate loading for form submission
  const [cooldown, setCooldown] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
      if (user) {
          navigate('/'); // Redirect to appropriate dashboard via App.tsx logic
      }
  }, [user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (cooldown) {
      setError('Please wait before attempting to sign up again.');
      return;
    }

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    if (!fullName.trim()) {
        setError('Full Name is required.');
        return;
    }


    setSubmitLoading(true);
    setCooldown(true); // Start cooldown period

    try {
      await signUp(email, password, role, fullName);

      // No need for alert, AuthContext handles redirection via App.tsx
      // navigate(role === 'admin' ? '/admin' : '/camper'); // This navigation will happen automatically in App.tsx

      // Optionally show a success message briefly before redirect happens
      console.log('Signup successful, redirecting...');
      // Let the AuthContext listener handle the profile loading and App.tsx handle the redirect

    } catch (err: any) {
      console.error('Signup error:', err);
      let errorMessage = 'Failed to create an account. Please try again.';
      if (err.code) {
          switch (err.code) {
              case 'auth/email-already-in-use':
                  errorMessage = 'This email address is already in use.';
                  break;
              case 'auth/invalid-email':
                  errorMessage = 'Please enter a valid email address.';
                  break;
              case 'auth/weak-password':
                  errorMessage = 'Password is too weak. Please use a stronger password.';
                  break;
               case 'auth/too-many-requests':
                  errorMessage = 'Too many signup attempts. Please wait a few minutes before trying again.';
                  // Keep cooldown active
                  setError(errorMessage);
                  setSubmitLoading(false); // Stop submit loading, but keep cooldown
                  // Don't reset cooldown immediately
                  setTimeout(() => setCooldown(false), 60000);
                  return; // Exit early
              // Add more specific Firebase error codes as needed
              default:
                  errorMessage = err.message || errorMessage;
          }
      } else if (err.message?.includes('rate_limit')) { // Keep generic rate limit check if needed
         errorMessage = 'Too many signup attempts. Please wait a minute before trying again.';
      }

      setError(errorMessage);
      setSubmitLoading(false); // Stop loading on error
      setCooldown(false); // Reset cooldown immediately on most errors
    }
    // Removed the finally block setting cooldown/loading, handled within try/catch now
    // Set a timeout to disable cooldown after 60 seconds ONLY IF not already handled by error case
    if (!error || error !== 'Too many signup attempts. Please wait a few minutes before trying again.') {
       setTimeout(() => {
         setCooldown(false);
       }, 60000); // 60 second cooldown
    }
     // Always ensure submitLoading is false after the timeout if it wasn't already set
     setTimeout(() => {
        setSubmitLoading(false);
     }, 100); // Small delay to ensure state updates propagate if needed

  };

  // Prevent rendering form if initial auth check is happening
  if (authLoading) {
      return <div>Loading...</div>; // Or a proper spinner
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-500">
              Sign in
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I am a...
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)} // Cast to Role type
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                disabled={submitLoading || cooldown}
              >
                <option value="camper">Camper</option>
                <option value="admin">Admin</option>
                {/* Removed Parent option */}
              </select>
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={submitLoading || cooldown}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={submitLoading || cooldown}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={submitLoading || cooldown}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long.
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitLoading || cooldown || authLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {submitLoading ? 'Creating account...' : cooldown ? 'Please wait...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;