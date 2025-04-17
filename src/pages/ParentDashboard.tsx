import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ParentDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile || profile.role !== 'parent') {
      navigate('/');
      return;
    }
  }, [profile, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Parent Dashboard</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">Register Camp</p>
                <p className="text-sm text-gray-600">Sign up for new camps</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">My Children</p>
                <p className="text-sm text-gray-600">Manage camper profiles</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-8 w-8 text-purple-600" />
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">Payments</p>
                <p className="text-sm text-gray-600">View and make payments</p>
              </div>
            </div>
          </button>

          <button className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <Bell className="h-8 w-8 text-yellow-600" />
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-900">Notifications</p>
                <p className="text-sm text-gray-600">Camp updates & alerts</p>
              </div>
            </div>
          </button>
        </div>

        {/* Upcoming Camps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Camps</h2>
          <div className="text-gray-500 text-center py-8">
            No upcoming camps registered
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Created</p>
                  <p className="text-xs text-gray-500">Account setup completed</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;