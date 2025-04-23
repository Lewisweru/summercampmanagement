import React, { useEffect, useState } from 'react'; // Keep React import
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
  Award,
  User // <-- ADD User icon import here
  // LogOut // <-- REMOVE LogOut icon import here
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock Data Interfaces
interface Activity {
    time: string;
    activity: string;
    location: string;
    icon?: React.ElementType;
}

interface Achievement {
    name: string;
    icon: React.ElementType;
    date: string;
}


const CamperDashboardComponent = () => { // Renamed component slightly
  const { profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Mock Data States
  const [upcomingActivities, setUpcomingActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading) {
        if (!profile || profile.role !== 'camper') {
           console.log('CamperDashboard: Redirecting - Not camper or profile missing.');
           navigate('/login');
           return;
        }
        console.log('CamperDashboard: Camper confirmed, loading data...');
        loadDashboardData();
    }
  }, [profile, authLoading, navigate]);

   const loadDashboardData = () => {
        setLoadingData(true);
        setTimeout(() => {
            setUpcomingActivities([
                { time: '9:00 AM', activity: 'Morning Hike', location: 'Forest Trail', icon: MapPin },
                { time: '11:00 AM', activity: 'Swimming Lessons', location: 'Lake Front', icon: Medal },
                { time: '2:00 PM', activity: 'Arts & Crafts', location: 'Craft Cabin', icon: Camera },
                { time: '4:00 PM', activity: 'Team Sports', location: 'Sports Field', icon: Users },
                { time: '7:00 PM', activity: 'Campfire Stories', location: 'Fire Pit', icon: Tent },
            ]);
             setAchievements([
                { name: 'First Campfire', icon: Tent, date: '2024-07-01' },
                { name: 'Swimming Badge', icon: Medal, date: '2024-07-03' },
                { name: 'Nature Explorer', icon: MapPin, date: '2024-07-05' },
                { name: 'Team Player Award', icon: Award, date: '2024-07-06' },
            ]);
            setLoadingData(false);
            console.log("CamperDashboard: Mock data loaded.");
        }, 300);
   };

   if (authLoading) {
       return (
         <div className="flex items-center justify-center h-screen">
           <div className="text-lg font-medium text-gray-600">Loading Dashboard...</div>
         </div>
       );
   }

    if (loadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-6 animate-pulse">
                 <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl p-6 shadow-sm mb-8 h-28"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                         <div className="bg-gray-200 h-24 rounded-xl"></div>
                         <div className="bg-gray-200 h-24 rounded-xl"></div>
                         <div className="bg-gray-200 h-24 rounded-xl"></div>
                         <div className="bg-gray-200 h-24 rounded-xl"></div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         <div className="bg-white rounded-xl shadow-sm p-6 h-64 lg:col-span-2"></div>
                         <div className="bg-white rounded-xl shadow-sm p-6 h-64"></div>
                    </div>
                 </div>
            </div>
        );
    }

  // The actual component render
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome back, <span className="text-green-700">{profile?.fullName}!</span> 🌟
              </h1>
              <p className="text-gray-600 mt-1 text-sm md:text-base">Ready for another exciting day at camp?</p>
            </div>
            <div className="flex-shrink-0 bg-gradient-to-br from-green-400 to-blue-500 p-1 rounded-full shadow">
              <div className="bg-white p-1 rounded-full">
                   {/* Profile picture uses User icon */}
                  <User className="h-10 w-10 sm:h-12 sm:w-12 text-gray-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
              {label: "Today's Schedule", icon: Calendar, color: 'blue'},
              {label: "My Cabin Mates", icon: Users, color: 'purple'},
              {label: "Photo Gallery", icon: Camera, color: 'green'},
              {label: "Message Home", icon: MessageCircle, color: 'yellow'},
          ].map((action) => (
             <button key={action.label} className={`bg-${action.color}-500 text-white p-4 rounded-xl shadow hover:bg-${action.color}-600 focus:outline-none focus:ring-2 focus:ring-${action.color}-500 focus:ring-opacity-50 transition-all transform hover:-translate-y-1 flex flex-col items-center justify-center aspect-square md:aspect-auto`}>
                <action.icon className="h-7 w-7 sm:h-8 sm:w-8 mb-2" />
                <h3 className="text-xs sm:text-sm font-semibold text-center">{action.label}</h3>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Today's Activities */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Today's Activities
            </h2>
            {upcomingActivities.length > 0 ? (
              <div className="space-y-3">
                {upcomingActivities.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                    <div className="flex items-center flex-grow min-w-0 mr-4">
                       <div className="bg-blue-100 p-2 rounded-full mr-3 flex-shrink-0">
                           {item.icon ? <item.icon className="h-4 w-4 text-blue-600" /> : <Clock className="h-4 w-4 text-blue-600" />}
                        </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{item.activity}</p>
                        <p className="text-xs text-gray-500 truncate">{item.location}</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded flex-shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-center text-gray-500 py-8 text-sm">No activities scheduled yet for today.</p>
            )}
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow p-4 md:p-6 border border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Recent Achievements
            </h2>
            {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3 text-yellow-600 flex-shrink-0">
                        <achievement.icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate text-sm">{achievement.name}</p>
                        <p className="text-xs text-gray-500">
                          Earned: {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
             ) : (
                <p className="text-center text-gray-500 py-8 text-sm">Keep exploring to earn achievements!</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Use named export for consistency
export { CamperDashboardComponent as CamperDashboard };