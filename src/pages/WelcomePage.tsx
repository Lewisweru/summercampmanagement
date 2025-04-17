import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Shield, Users } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Adventure Awaits at Camp Explorer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover unforgettable experiences and make lifelong friendships
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/signup"
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Start Your Journey
          </Link>
          <Link
            to="/about"
            className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Featured Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <img
          src="https://images.unsplash.com/photo-1517164850305-99a3e65bb47e"
          alt="Camping"
          className="rounded-lg shadow-md h-64 w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
          alt="Activities"
          className="rounded-lg shadow-md h-64 w-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1546058256-47154de4046c"
          alt="Nature"
          className="rounded-lg shadow-md h-64 w-full object-cover"
        />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Beautiful Locations</h3>
          <p className="text-gray-600">Carefully selected camping sites in nature's best spots</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
          <p className="text-gray-600">Choose from various camp dates and durations</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Safety First</h3>
          <p className="text-gray-600">Certified staff and comprehensive safety measures</p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
          <p className="text-gray-600">Experienced counselors and activity leaders</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-green-50 rounded-xl p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready for an Adventure?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join us for an unforgettable summer experience
        </p>
        <Link
          to="/signup"
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition inline-block"
        >
          Register Now
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;