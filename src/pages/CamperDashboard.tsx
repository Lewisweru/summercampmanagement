import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Tent, 
  Users, 
  Medal, 
  Calendar, 
  MapPin, 
  Camera,
  Clock,
  MessageCircle,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CamperDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile || profile.role !== 'camper') {
      navigate('/');
    }
  }, [profile, navigate]);

  const upcomingActivities = [
    { time: '9:00 AM', activity: 'Morning Nature Walk', location: 'Forest Trail' },
    { time: '11:00 AM', activity: 'Swimming Lessons', location: 'Lake Front' },
    { time: '2:00 PM', activity: 'Arts & Crafts', location: 'Craft Cabin' },
    { time: '4:00 PM', activity: 'Team Sports', location: 'Sports Field' },
  ];

  const achievements = [
    { name: 'First Campfire', icon: <Tent className="h-6 w-6" />, date: '2024-03-15' },
    { name: 'Swimming Badge', icon: <Medal className="h-6 w-6" />, date: '2024-03-16' },
    { name: 'Nature Explorer', icon: <MapPin className="h-6 w-6" />, date: '2024-03-17' },
    { name: 'Team Player', icon: <Users className="h-6 w-6" />, date: '2024-03-18' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile?.full_name}! 🌟
              </h1>
              <p className="text-gray-600 mt-2">Ready for another exciting day at camp?</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <Tent className="h-12 w-12 text-green-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <button className="bg-blue-500 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <Calendar className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Today's Schedule</h3>
            </div>
          </button>
          <button className="bg-purple-500 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <Users className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">My Cabin Mates</h3>
            </div>
          </button>
          <button className="bg-green-500 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <Camera className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Photo Gallery</h3>
            </div>
          </button>
          <button className="bg-yellow-500 text-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1">
            <div className="flex flex-col items-center text-center">
              <MessageCircle className="h-8 w-8 mb-2" />
              <h3 className="font-semibold">Message Home</h3>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Today's Activities */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Today's Activities
            </h2>
            <div className="space-y-4">
              {upcomingActivities.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.activity}</p>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3 text-yellow-600">
                    {achievement.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{achievement.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CamperDashboard;