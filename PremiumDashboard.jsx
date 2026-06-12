import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = 'http://localhost:8000';

function Premium({ setToken }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      
      // If user is already premium, redirect to dashboard
      if (response.data.is_premium) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/premium/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update user info
      setUser({
        ...user,
        is_premium: true,
        neuracoins: response.data.remaining_coins
      });

      // Show success and redirect
      alert('🎉 Welcome to NeuraLife+! You now have access to premium features!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Purchase failed. Please try again.');
      setLoading(false);
    }
  };

  const handleDecline = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar setToken={setToken} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-2xl text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  const PREMIUM_COST = 1000;
  const canAfford = user.neuracoins >= PREMIUM_COST;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Navbar setToken={setToken} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Upgrade to NeuraLife+
            </h1>
            <p className="text-indigo-100 text-lg">
              Unlock premium features for better mental wellness
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-10">
            {/* Current Balance */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 mb-8 border-2 border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your Balance</p>
                  <p className="text-3xl font-bold text-amber-600">
                    🪙 {user.neuracoins} NeuraCoins
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Premium Cost</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {PREMIUM_COST} NeuraCoins
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                What you'll get with NeuraLife+:
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: '🤖', title: 'Advanced AI Therapy', desc: 'GPT-powered chatbot with memory' },
                  { icon: '📊', title: 'Detailed Analytics', desc: 'Track your mood trends over time' },
                  { icon: '🎵', title: 'Premium Resources', desc: 'Exclusive playlists and content' },
                  { icon: '👥', title: 'Group Support', desc: 'Join private support communities' },
                  { icon: '📱', title: 'Mobile Access', desc: 'iOS & Android apps included' },
                  { icon: '⚡', title: 'Priority Support', desc: '24/7 dedicated human support' },
                  { icon: '💎', title: 'Ad-Free', desc: 'No advertisements, ever' },
                  { icon: '🎓', title: 'Expert Courses', desc: 'Mental health masterclasses' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-indigo-50 transition">
                    <span className="text-2xl">{feature.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                ⚠️ {error}
              </div>
            )}

            {/* Insufficient Balance Warning */}
            {!canAfford && (
              <div className="bg-yellow-50 border-2 border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mb-6">
                ⚠️ You need {PREMIUM_COST - user.neuracoins} more NeuraCoins to purchase NeuraLife+
              </div>
            )}

            {/* Confirmation Question */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <p className="text-xl font-semibold text-center text-gray-800 mb-2">
                Ready to upgrade your wellness journey?
              </p>
              <p className="text-center text-gray-600">
                Purchase NeuraLife+ for <span className="font-bold text-purple-600">{PREMIUM_COST} NeuraCoins</span>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleDecline}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition text-lg"
              >
                Decline
              </button>
              <button
                onClick={handlePurchase}
                disabled={loading || !canAfford}
                className={`flex-1 px-6 py-4 rounded-xl font-semibold transition text-lg ${
                  canAfford && !loading
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Processing...' : `Yes, Buy for ${PREMIUM_COST} 🪙`}
              </button>
            </div>

            {/* Cancel Link */}
            <div className="text-center mt-4">
              <button
                onClick={handleDecline}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Premium;
