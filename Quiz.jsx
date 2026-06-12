import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PremiumNavbar from './PremiumNavbar';

const API_URL = 'http://localhost:8000';

function PremiumDashboard({ setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    fetchUserInfo();
    fetchUpcomingSessions();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);

      // Redirect if not premium
      if (!response.data.is_premium) {
        navigate('/premium');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/therapy/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpcomingSessions(response.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 transition-colors duration-500">
      <PremiumNavbar setToken={setToken} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-amber-200 hover:text-indigo-600 dark:hover:text-amber-100 font-medium transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Main Dashboard
          </button>
        </div>

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-amber-500 to-purple-600 dark:from-amber-600 dark:to-purple-700 rounded-2xl shadow-2xl p-8 text-white mb-8 transform hover:scale-[1.02] transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                Welcome to NeuraLife+ ⭐
              </h1>
              <p className="text-xl text-amber-100 dark:text-amber-50">
                Hello, {user.username}! Access your premium features below.
              </p>
            </div>
            <div className="text-6xl animate-pulse">🎉</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-transparent dark:border-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">NeuraCoins</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 transition-colors duration-300">🪙 {user.neuracoins}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-transparent dark:border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Therapy Sessions</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">{upcomingSessions.length}</p>
              </div>
              <div className="text-4xl">👨‍⚕️</div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border border-transparent dark:border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Status</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">Premium Active</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Calendar Card */}
          <div 
            onClick={() => navigate('/premium-calendar')}
            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-transparent dark:border-amber-500/30 hover:border-amber-400 dark:hover:border-amber-400"
          >
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-amber-100 mb-2 transition-colors duration-300">Calendar</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
              Schedule and manage your therapy sessions, set reminders, and track your wellness journey.
            </p>
            <button className="text-purple-600 dark:text-amber-400 font-semibold hover:underline transition-colors duration-300">
              Open Calendar →
            </button>
          </div>

          {/* Therapy Sessions Card */}
          <div 
            onClick={() => navigate('/therapy-sessions')}
            className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-transparent dark:border-purple-500/30 hover:border-purple-400 dark:hover:border-purple-400"
          >
            <div className="text-5xl mb-4">👨‍⚕️</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-purple-100 mb-2 transition-colors duration-300">Therapy Sessions</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
              Connect with licensed therapists, book sessions, and message them directly for support.
            </p>
            <button className="text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-colors duration-300">
              Browse Therapists →
            </button>
          </div>

          {/* Advanced AI Card */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent dark:border-indigo-500/30 hover:border-indigo-400 dark:hover:border-indigo-400">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-indigo-100 mb-2 transition-colors duration-300">Advanced AI Therapy</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
              Chat with our premium AI that remembers your conversations and provides personalized support.
            </p>
            <button className="text-purple-600 dark:text-indigo-400 font-semibold hover:underline transition-colors duration-300">
              Start Chat →
            </button>
          </div>

          {/* Analytics Card */}
          <div className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent dark:border-pink-500/30 hover:border-pink-400 dark:hover:border-pink-400">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-pink-100 mb-2 transition-colors duration-300">Wellness Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
              Track your mood trends, session history, and mental health progress over time.
            </p>
            <button className="text-purple-600 dark:text-pink-400 font-semibold hover:underline transition-colors duration-300">
              View Analytics →
            </button>
          </div>
        </div>

        {/* Upcoming Sessions */}
        {upcomingSessions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-300 border border-transparent dark:border-purple-500/20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Upcoming Sessions</h2>
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map(session => (
                <div key={session.id} className="border-l-4 border-purple-500 dark:border-amber-500 bg-purple-50 dark:bg-purple-900/30 p-4 rounded transition-colors duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">{session.therapist_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">{session.date} at {session.time}</p>
                    </div>
                    <span className="bg-purple-600 dark:bg-amber-600 text-white px-3 py-1 rounded-full text-sm transition-colors duration-300">
                      {session.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PremiumDashboard;
