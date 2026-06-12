import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Resources from './components/Resources';
import Chatbot from './components/Chatbot';
import Quiz from './components/Quiz';
import Premium from './components/Premium';
import PremiumDashboard from './components/PremiumDashboard';
import PremiumCalendar from './components/PremiumCalendar';
import TherapySessions from './components/TherapySessions';
import TherapyChat from './components/TherapyChat';

function App() {
  // Check for OAuth token in URL BEFORE initializing state
  const params = new URLSearchParams(window.location.search);
  const urlToken = params.get('token');
  const urlUsername = params.get('username');
  
  // If OAuth callback, use that token; otherwise check localStorage
  const initialToken = urlToken || localStorage.getItem('token');
  
  const [token, setToken] = useState(initialToken);
  const [isOAuthCallback, setIsOAuthCallback] = useState(!!urlToken);

  // Handle OAuth callback at root level
  useEffect(() => {
    if (urlToken && urlUsername) {
      console.log('OAuth callback detected in App.jsx');
      console.log('Username:', urlUsername);
      console.log('Token:', urlToken.substring(0, 20) + '...');
      
      setToken(urlToken);
      localStorage.setItem('token', urlToken);
      localStorage.setItem('username', urlUsername);
      setIsOAuthCallback(false);
      
      // Clean URL and redirect to dashboard
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [urlToken, urlUsername]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  // Show loading during OAuth callback processing
  if (isOAuthCallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in with Google...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute>
                <Resources setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium"
            element={
              <ProtectedRoute>
                <Premium setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium-dashboard"
            element={
              <ProtectedRoute>
                <PremiumDashboard setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium-calendar"
            element={
              <ProtectedRoute>
                <PremiumCalendar setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/therapy-sessions"
            element={
              <ProtectedRoute>
                <TherapySessions setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/therapy-chat/:therapistId"
            element={
              <ProtectedRoute>
                <TherapyChat setToken={setToken} />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
