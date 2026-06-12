import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = 'http://localhost:8000';

function Dashboard({ setToken }) {
  const [user, setUser] = useState(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [tagline, setTagline] = useState('');
  const navigate = useNavigate();

  const inspirationalQuotes = [
    "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    "Healing is not linear. Be patient with yourself on the difficult days.",
    "You are stronger than you know. You are doing better than you think.",
    "Taking care of yourself doesn't mean me first, it means me too.",
    "Progress, not perfection. Every small step forward counts.",
    "It's okay to not be okay. Reach out when you need support.",
  ];

  const taglines = [
    "We're here to support you every step of the way",
    "Your mental wellness journey starts here",
    "Building better mental health together",
    "Empowering your path to emotional wellness",
    "Compassionate support when you need it most",
    "Your safe space for mental health care",
    "Taking care of your mind, one day at a time",
    "Where healing meets hope and understanding",
    "Supporting your journey to better mental health",
    "Because your mental health matters",
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Set random tagline
    const randomTagline = taglines[Math.floor(Math.random() * taglines.length)];
    setTagline(randomTagline);

    // Rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspirationalQuotes.length);
    }, 8000);

    return () => clearInterval(quoteInterval);
  }, []);

  const quickActions = [
    {
      icon: '💬',
      title: 'Talk to AI Assistant',
      description: 'Get immediate support and coping strategies',
      gradient: 'from-blue-500 to-cyan-500',
      path: '/chatbot',
      highlight: true
    },
    {
      icon: '📝',
      title: 'Mental Health Assessment',
      description: 'Understand your current wellbeing',
      gradient: 'from-purple-500 to-pink-500',
      path: '/quiz'
    },
    {
      icon: '📚',
      title: 'Wellness Resources',
      description: 'Explore helpful content and tools',
      gradient: 'from-green-500 to-teal-500',
      path: '/resources'
    }
  ];

  const wellnessTips = [
    { icon: '🧘‍♀️', title: 'Practice Mindfulness', desc: '5 minutes daily meditation' },
    { icon: '🚶‍♂️', title: 'Stay Active', desc: 'Take a short walk today' },
    { icon: '💧', title: 'Stay Hydrated', desc: 'Drink water regularly' },
    { icon: '😴', title: 'Quality Sleep', desc: '7-9 hours each night' },
    { icon: '🤝', title: 'Connect', desc: 'Reach out to someone' },
    { icon: '📖', title: 'Journal', desc: 'Write down your thoughts' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar setToken={setToken} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <div className="animate-pulse text-6xl">💫✨</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">
            {greeting}, {user?.username || 'Friend'}!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 transition-colors duration-300">
            {tagline}
          </p>
        </div>

        {/* Quick Actions - Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action, index) => (
            <div
              key={index}
              onClick={() => navigate(action.path)}
              className={`relative overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                action.highlight ? 'md:col-span-3 lg:col-span-1' : ''
              }`}
            >
              <div className={`bg-gradient-to-br ${action.gradient} rounded-2xl shadow-lg p-6 h-full`}>
                <div className="text-white">
                  <div className="text-5xl mb-4">{action.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                  <p className="text-white/90 mb-4">{action.description}</p>
                  <div className="flex items-center text-white font-semibold">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                {action.highlight && (
                  <div className="absolute top-4 right-4 bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    Popular
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Daily Wellness Tips */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10 transition-colors duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center transition-colors duration-300">
              <span className="mr-2">🌱</span>
              Daily Wellness Tips
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Small steps, big impact</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {wellnessTips.map((tip, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl mb-2">{tip.icon}</div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1 transition-colors duration-300">{tip.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-300 transition-colors duration-300">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirational Quote */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-white mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="mr-2">💙</span>
                Daily Inspiration
              </h2>
              <div className="flex gap-2">
                {inspirationalQuotes.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentQuote ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed transition-opacity duration-500">
              "{inspirationalQuotes[currentQuote]}"
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Crisis Resources */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 transition-colors duration-300">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🆘</div>
              <div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-200 mb-2 transition-colors duration-300">Need Immediate Help?</h3>
                <p className="text-red-800 dark:text-red-300 mb-4 transition-colors duration-300">If you're in crisis, please reach out:</p>
                <div className="space-y-2 text-red-900 dark:text-red-200 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">📞 Call:</span>
                    <a href="tel:1800-599-0019" className="underline hover:no-underline">1800-599-0019 (Suicide & Crisis Lifeline)</a>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">💬 Text:</span>
                    <span>HOME to 741741 (Crisis Text Line)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Community Support */}
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 transition-colors duration-300">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🤗</div>
              <div>
                <h3 className="text-xl font-bold text-green-900 dark:text-green-200 mb-2 transition-colors duration-300">You're Not Alone</h3>
                <p className="text-green-800 dark:text-green-300 mb-4 transition-colors duration-300">Remember:</p>
                <ul className="space-y-2 text-green-900 dark:text-green-200 transition-colors duration-300">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Your feelings are valid</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Seeking help is a sign of strength</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Recovery is possible</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>We're here for you 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
