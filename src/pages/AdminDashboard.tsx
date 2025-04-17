import React, { useEffect, useState } from 'react';
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
  AlertTriangle,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Profile } from '../lib/database.types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  camperId: string;
  packageId: string;
  status: 'pending' | 'approved' | 'denied';
  paymentStatus: 'pending' | 'completed';
  amount: number;
  createdAt: string;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [campers, setCampers] = useState<Profile[]>([]);
  const [packages, setPackages] = useState<CampPackage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      navigate('/');
      return;
    }

    // Mock data for demonstration
    setCampers([
      {
        id: '1',
        role: 'camper',
        full_name: 'John Doe',
        email: 'john@example.com',
        date_of_birth: '2010-01-01',
      },
      {
        id: '2',
        role: 'camper',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        date_of_birth: '2011-02-15',
      },
    ]);

    setPackages([
      {
        id: '1',
        name: 'Summer Adventure',
        description: 'Two weeks of outdoor activities',
        price: 1200,
        capacity: 30,
        startDate: '2024-06-01',
        endDate: '2024-06-14',
        activities: ['Hiking', 'Swimming', 'Archery'],
      },
    ]);

    setBookings([
      {
        id: '1',
        camperId: '1',
        packageId: '1',
        status: 'pending',
        paymentStatus: 'pending',
        amount: 1200,
        createdAt: '2024-03-15',
      },
    ]);

    setLoading(false);
  }, [profile, navigate]);

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Campers</p>
                    <p className="text-2xl font-semibold">{campers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Packages</p>
                    <p className="text-2xl font-semibold">{packages.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-semibold">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-semibold">
                      ${bookings.reduce((sum, b) => sum + b.amount, 0)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Overview</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'campers':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Manage Campers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date of Birth</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campers.map((camper) => (
                    <tr key={camper.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{camper.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{camper.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {camper.date_of_birth ? new Date(camper.date_of_birth).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">View Details</button>
                        <button className="text-red-600 hover:text-red-900">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Camp Packages</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Add New Package
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 mb-4">{pkg.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Price:</strong> ${pkg.price}</p>
                    <p className="text-sm"><strong>Capacity:</strong> {pkg.capacity} campers</p>
                    <p className="text-sm"><strong>Duration:</strong> {pkg.startDate} - {pkg.endDate}</p>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Manage Bookings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Camper</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {campers.find(c => c.id === booking.camperId)?.full_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {packages.find(p => p.id === booking.packageId)?.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                          booking.status === 'denied' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-green-600 hover:text-green-900 mr-3">Approve</button>
                        <button className="text-red-600 hover:text-red-900">Deny</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('campers')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'campers' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Campers</span>
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'packages' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Packages</span>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'bookings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'payments' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span>Payments</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'feedback' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span>Feedback</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Reports</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;