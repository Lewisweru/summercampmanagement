import React from 'react';
import { Shield, Heart, Sun, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Camp Explorer</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          We're dedicated to creating unforgettable summer experiences that combine adventure,
          learning, and friendship in a safe and nurturing environment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <img
            src="https://images.unsplash.com/photo-1530541930197-ff16ac917b0e"
            alt="Camp Activities"
            className="rounded-lg shadow-lg h-96 w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Camp Explorer, we believe every child deserves the opportunity to explore,
            grow, and discover their potential in a supportive community. Our programs are
            designed to build confidence, foster independence, and create lasting memories.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">Safe Environment</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">Caring Staff</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">Outdoor Adventure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">Quality Programs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-12 mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Safety First</h3>
            <p className="text-gray-600">
              Comprehensive safety protocols and trained staff ensure your child's wellbeing
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Staff</h3>
            <p className="text-gray-600">
              Experienced counselors passionate about youth development
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inclusive Community</h3>
            <p className="text-gray-600">
              A welcoming environment where every camper belongs
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join Us?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Start your camp adventure today and create memories that last a lifetime.
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default About;