import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PremiumNavbar from './PremiumNavbar';

const API_URL = 'http://localhost:8000';

function PremiumCalendar({ setToken }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, [currentDate]);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/therapy/my-sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getSessionsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return sessions.filter(s => s.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <PremiumNavbar setToken={setToken} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/premium-dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Premium Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">📅 Your Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={previousMonth}
                className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition"
              >
                ←
              </button>
              <h2 className="text-2xl font-semibold text-purple-600">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 rounded-lg bg-purple-100 hover:bg-purple-200 transition"
              >
                →
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Names */}
            {dayNames.map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {[...Array(startingDayOfWeek)].map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square"></div>
            ))}

            {/* Calendar Days */}
            {[...Array(daysInMonth)].map((_, index) => {
              const day = index + 1;
              const sessionsOnDay = getSessionsForDate(day);
              const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square border rounded-lg p-2 cursor-pointer transition hover:shadow-lg ${
                    isToday ? 'bg-purple-100 border-purple-500 font-bold' : 'bg-white border-gray-200'
                  } ${selectedDate === day ? 'ring-2 ring-purple-500' : ''}`}
                >
                  <div className="text-right text-sm">{day}</div>
                  {sessionsOnDay.length > 0 && (
                    <div className="mt-1">
                      {sessionsOnDay.map((session, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-purple-500 text-white rounded px-1 py-0.5 mb-1 truncate"
                          title={`${session.time} - ${session.therapist_name}`}
                        >
                          {session.time}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Date Info */}
          {selectedDate && (
            <div className="mt-8 p-6 bg-purple-50 rounded-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Sessions on {monthNames[currentDate.getMonth()]} {selectedDate}
              </h3>
              {getSessionsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getSessionsForDate(selectedDate).map(session => (
                    <div key={session.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{session.therapist_name}</p>
                          <p className="text-sm text-gray-600">⏰ {session.time}</p>
                          <p className="text-sm text-gray-600">📍 {session.type || 'Video Call'}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No sessions scheduled for this day.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PremiumCalendar;
