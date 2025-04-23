import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  DollarSign,
  Bell,
  Package,
  MessageSquare,
  FileText,
  Settings,
  // AlertTriangle, // Removed unused
  // Star // Removed unused
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// Removed Profile import as it's defined in AuthContext now
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Interfaces for Mock Data (Keep for now, replace with actual data fetching)
interface CampPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  startDate: string;
  endDate: string;
  activities: string[];
}

interface Booking {
  id: string;
  camperId: string; // Should match Profile._id or firebaseUid
  camperName?: string; // Added for display
  packageId: string;
  packageName?: string; // Added for display
  status: 'pending' | 'approved' | 'denied';
  paymentStatus: 'pending' | 'completed';
  amount: number;
  createdAt: string;
}

// Mock Camper Profile Interface (aligns better with context/MongoDB)
interface CamperProfile {
  _id: string;
  firebaseUid: string;
  role: 'camper';
  fullName: string;
  email: string;
  dateOfBirth?: string | Date | null;
}


const AdminDashboard = () => {
  const { profile, loading: authLoading } = useAuth(); // Use profile from context
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // --- Mock Data Section (Replace with API calls) ---
  const [campers, setCampers] = useState<CamperProfile[]>([]);
  const [packages, setPackages] = useState<CampPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingData, setLoadingData] = useState(true); // Separate loading for dashboard data
  const [revenueData, setRevenueData] = useState<{month: string, revenue: number}[]>([]);
  // --- End Mock Data Section ---

  useEffect(() => {
    // Redirect check runs only after auth loading is complete
    if (!authLoading) {
        if (!profile || profile.role !== 'admin') {
          console.log('Redirecting: Not an admin or profile not loaded.');
          navigate('/login'); // Redirect to login if not admin
          return; // Stop further execution in this effect
        } else {
           // If admin profile is confirmed, proceed to load dashboard data
           console.log('Admin confirmed, loading dashboard data...');
           loadDashboardData();
        }
    }
  }, [profile, authLoading, navigate]);


  // Function to load mock data (replace with actual API calls)
  const loadDashboardData = () => {
      setLoadingData(true);
      // Simulate API call delay
      setTimeout(() => {
          // Mock Campers
          const mockCampers: CamperProfile[] = [
                {
                    _id: 'mongoId1', firebaseUid: 'firebaseUid1', role: 'camper', fullName: 'John Doe', email: 'john@example.com', dateOfBirth: '2010-01-01',
                },
                {
                    _id: 'mongoId2', firebaseUid: 'firebaseUid2', role: 'camper', fullName: 'Jane Smith', email: 'jane@example.com', dateOfBirth: '2011-02-15',
                },
                {
                    _id: 'mongoId3', firebaseUid: 'firebaseUid3', role: 'camper', fullName: 'Peter Jones', email: 'peter@example.com', dateOfBirth: '2012-03-20',
                },
            ];
          setCampers(mockCampers);

          // Mock Packages
           const mockPackages: CampPackage[] = [
                {
                    id: 'pkg1', name: 'Summer Adventure', description: 'Two weeks of outdoor fun!', price: 1200, capacity: 30, startDate: '2024-07-01', endDate: '2024-07-14', activities: ['Hiking', 'Swimming', 'Archery', 'Campfire Songs'],
                },
                 {
                    id: 'pkg2', name: 'Wilderness Explorer', description: 'Advanced survival skills.', price: 1500, capacity: 20, startDate: '2024-07-15', endDate: '2024-07-28', activities: ['Tracking', 'Shelter Building', 'Orienteering'],
                },
            ];
          setPackages(mockPackages);

          // Mock Bookings (link camperId to mockCampers _id or firebaseUid)
          const mockBookings: Booking[] = [
                {
                    id: 'booking1', camperId: 'firebaseUid1', packageId: 'pkg1', status: 'approved', paymentStatus: 'completed', amount: 1200, createdAt: '2024-03-15T10:00:00Z',
                },
                {
                    id: 'booking2', camperId: 'firebaseUid2', packageId: 'pkg1', status: 'pending', paymentStatus: 'pending', amount: 1200, createdAt: '2024-04-01T14:30:00Z',
                },
                 {
                    id: 'booking3', camperId: 'firebaseUid3', packageId: 'pkg2', status: 'approved', paymentStatus: 'pending', amount: 1500, createdAt: '2024-04-10T09:15:00Z',
                },
                 {
                    id: 'booking4', camperId: 'firebaseUid1', packageId: 'pkg2', status: 'denied', paymentStatus: 'pending', amount: 1500, createdAt: '2024-04-11T11:00:00Z',
                },
            ];
            // Add camper and package names for easier display
            mockBookings.forEach(b => {
                b.camperName = mockCampers.find(c => c.firebaseUid === b.camperId)?.fullName;
                b.packageName = mockPackages.find(p => p.id === b.packageId)?.name;
            });

          setBookings(mockBookings);

          // Mock Revenue Data
          setRevenueData([
              { month: 'Apr', revenue: 1200 },
              { month: 'May', revenue: 2700 },
              { month: 'Jun', revenue: 5000 },
              { month: 'Jul', revenue: 18000 }, // Projected
           ]);


          setLoadingData(false);
          console.log("Mock dashboard data loaded.");
      }, 500); // Simulate 0.5 second load time
  };

  const getTotalRevenue = () => {
      return bookings
          .filter(b => b.paymentStatus === 'completed')
          .reduce((sum, b) => sum + b.amount, 0);
  }


  const renderTabContent = () => {
    // Show loading state for data
    if (loadingData) {
       return (
         <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
           <div className="text-gray-500">Loading dashboard data...</div>
         </div>
       );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Campers */}
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Campers</p>
                    <p className="text-2xl font-semibold text-gray-900">{campers.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                     <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              {/* Active Packages */}
               <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Packages</p>
                    <p className="text-2xl font-semibold text-gray-900">{packages.length}</p>
                  </div>
                   <div className="bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                   </div>
                </div>
              </div>
               {/* Pending Bookings */}
               <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Bookings</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                   <div className="bg-yellow-100 p-3 rounded-full">
                     <Calendar className="h-6 w-6 text-yellow-600" />
                   </div>
                </div>
              </div>
                {/* Total Revenue */}
               <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Completed Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      ${getTotalRevenue().toLocaleString()}
                    </p>
                  </div>
                   <div className="bg-purple-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                   </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Revenue</h3>
              <div className="h-80"> {/* Increased height */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                    <XAxis dataKey="month" stroke="#6b7280"/>
                    <YAxis stroke="#6b7280"/>
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ccc', borderRadius: '4px' }}
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                     />
                    <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'campers':
        return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Manage Campers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campers.length > 0 ? campers.map((camper) => (
                    <tr key={camper._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{camper.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{camper.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {camper.dateOfBirth ? new Date(camper.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3 transition duration-150 ease-in-out">View Details</button>
                        <button className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">Remove</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                            No campers found.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
             {/* Add Pagination if needed */}
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Camp Packages</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm font-medium shadow-sm transition duration-150 ease-in-out">
                Add New Package
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.length > 0 ? packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
                  <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{pkg.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                      <div className="space-y-1 text-sm mb-4">
                        <p><strong>Price:</strong> ${pkg.price.toLocaleString()}</p>
                        <p><strong>Capacity:</strong> {pkg.capacity} campers</p>
                        <p><strong>Dates:</strong> {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}</p>
                        <p><strong>Activities:</strong> {pkg.activities.join(', ')}</p>
                      </div>
                  </div>
                  <div className="mt-4 flex space-x-2 border-t pt-4 border-gray-100">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150 ease-in-out">Edit</button>
                    <button className="text-sm text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out">Delete</button>
                  </div>
                </div>
              )) : (
                 <p className="text-center text-gray-500 col-span-full py-12">No packages created yet.</p>
              )}
            </div>
          </div>
        );

      case 'bookings':
         return (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Manage Bookings</h2>
              {/* Add Filters/Search Here */}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Camper</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Status</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.length > 0 ? bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.camperName || 'N/A'}
                        </div>
                         <div className="text-xs text-gray-500">{campers.find(c => c.firebaseUid === booking.camperId)?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {booking.packageName || 'N/A'}
                        </div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          ${booking.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'denied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       {booking.status === 'pending' && (
                            <>
                                <button className="text-green-600 hover:text-green-900 mr-3 transition duration-150 ease-in-out">Approve</button>
                                <button className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out">Deny</button>
                            </>
                       )}
                       {booking.status !== 'pending' && (
                           <button className="text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out">View</button>
                       )}
                      </td>
                    </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                            No bookings found.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
              {/* Add Pagination if needed */}
          </div>
        );


       // Placeholder for other tabs
       case 'payments':
       case 'notifications':
       case 'feedback':
       case 'reports':
           return (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 capitalize">{activeTab}</h2>
                    <p className="text-gray-500">This section is under construction.</p>
                </div>
           );

      default:
        return null;
    }
  };

   // Show loading screen for auth check
   if (authLoading) {
       return (
         <div className="flex items-center justify-center h-screen">
           <div>Loading Admin Dashboard...</div>
         </div>
       );
   }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="space-y-1 bg-white rounded-lg shadow p-4">
                {[
                    { key: 'overview', label: 'Overview', icon: Settings },
                    { key: 'campers', label: 'Campers', icon: Users },
                    { key: 'packages', label: 'Packages', icon: Package },
                    { key: 'bookings', label: 'Bookings', icon: Calendar },
                    { key: 'payments', label: 'Payments', icon: DollarSign },
                    { key: 'notifications', label: 'Notifications', icon: Bell },
                    { key: 'feedback', label: 'Feedback', icon: MessageSquare },
                    { key: 'reports', label: 'Reports', icon: FileText },
                ].map(item => (
                    <button
                        key={item.key}
                        onClick={() => setActiveTab(item.key)}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                            activeTab === item.key
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                        >
                        <item.icon className="h-5 w-5" aria-hidden="true" />
                        <span>{item.label}</span>
                    </button>
                 ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;