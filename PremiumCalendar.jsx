import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function Navbar({ setToken }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('User');
  const [isPremium, setIsPremium] = useState(false);
  const [neuracoins, setNeuracoins] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Check for saved dark mode preference, default to FALSE (light mode)
    const savedDarkMode = localStorage.getItem('darkMode');
    const isDark = savedDarkMode === 'true'; // Only true if explicitly set to 'true'
    
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Get username from localStorage or fetch from API
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Fetch user info to get premium status
    fetchUserInfo();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const axios = (await import('axios')).default;
      const response = await axios.get('http://localhost:8000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPremium(response.data.is_premium);
      setNeuracoins(response.data.neuracoins);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleSwitchAccount = () => {
    handleLogout();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Get first letter of username for avatar
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              🧠 NeuraLife
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/resources"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Resources
            </Link>
            <Link
              to="/chatbot"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Chatbot
            </Link>
            <Link
              to="/quiz"
              className="px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition font-medium"
            >
              Quizzes
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {avatarLetter}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50 transition-colors duration-300">
                  <div className="py-2">
                    {/* User Info Section */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {username} {isPremium && <span className="text-amber-500">⭐</span>}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your account</p>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                        🪙 {neuracoins} NeuraCoins
                      </p>
                    </div>

                    {/* Profile Option */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center"
                    >
                      <span className="mr-3">👤</span>
                      View Profile
                    </button>

                    {/* Buy NeuraLife+ / Go + Option */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        if (isPremium) {
                          // Premium user - navigate to premium dashboard
                          navigate('/premium-dashboard');
                        } else {
                          // Non-premium user - navigate to purchase page
                          navigate('/premium');
                        }
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition flex items-center ${
                        isPremium
                          ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-600 font-semibold'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-amber-50 dark:hover:bg-gray-600 hover:text-amber-600 dark:hover:text-amber-400'
                      }`}
                    >
                      <span className="mr-3">⭐</span>
                      {isPremium ? 'Go +' : 'Buy NeuraLife+'}
                    </button>

                    {/* Switch Account Option */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleSwitchAccount();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center"
                    >
                      <span className="mr-3">🔄</span>
                      Switch Account
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-100 dark:border-gray-600 my-1"></div>

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-600 transition flex items-center"
                    >
                      <span className="mr-3">🚪</span>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
