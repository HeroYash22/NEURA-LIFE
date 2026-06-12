import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PremiumNavbar from './PremiumNavbar';

const API_URL = 'http://localhost:8000';

function TherapySessions({ setToken }) {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [myTherapists, setMyTherapists] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    type: 'in-person',
    notes: ''
  });

  useEffect(() => {
    fetchTherapists();
    fetchMyTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/therapy/therapists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTherapists(response.data.therapists || []);
    } catch (err) {
      console.error('Error fetching therapists:', err);
    }
  };

  const fetchMyTherapists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/therapy/my-therapists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyTherapists(response.data.therapists || []);
    } catch (err) {
      console.error('Error fetching my therapists:', err);
    }
  };

  const handleOptIn = async (therapistId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/therapy/opt-in`,
        { therapist_id: therapistId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Successfully opted in! You can now message this therapist.');
      fetchMyTherapists();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to opt in');
    }
  };

  const openMessaging = (therapist) => {
    navigate(`/therapy-chat/${therapist.id}`, { state: { therapist } });
  };

  const openBookingModal = (therapist) => {
    setSelectedTherapist(therapist);
    const today = new Date().toISOString().split('T')[0];
    setBookingData({ date: today, time: '', type: 'in-person', notes: '' });
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedTherapist(null);
    setBookingData({ date: '', time: '', type: 'in-person', notes: '' });
  };

  const handleBookAppointment = async () => {
    if (!bookingData.date || !bookingData.time) {
      alert('Please select both date and time');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/therapy/book-appointment`,
        {
          therapist_id: selectedTherapist.id,
          date: bookingData.date,
          time: bookingData.time,
          type: bookingData.type,
          notes: bookingData.notes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Appointment request sent successfully! Waiting for therapist approval.');
      closeBookingModal();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to book appointment');
    }
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

        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 transition-colors duration-300">👨‍⚕️ Therapy Sessions</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'browse'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Browse Therapists
          </button>
          <button
            onClick={() => setActiveTab('my-therapists')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'my-therapists'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Therapists ({myTherapists.length})
          </button>
        </div>

        {/* Browse Therapists */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map(therapist => (
              <div key={therapist.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-32 relative">
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white flex items-center justify-center text-4xl">
                      {therapist.avatar || '👨‍⚕️'}
                    </div>
                  </div>
                </div>
                
                <div className="pt-16 px-6 pb-6">
                  <h3 className="text-xl font-bold text-center text-gray-800 mb-1">
                    {therapist.name}
                  </h3>
                  <p className="text-center text-purple-600 text-sm font-semibold mb-3">
                    {therapist.specialization}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">🎓</span>
                      <span>{therapist.credentials}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      <span>{therapist.experience} years experience</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">⭐</span>
                      <span>{therapist.rating} / 5.0 ({therapist.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">💰</span>
                      <span>{therapist.cost} NeuraCoins/session</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {therapist.bio}
                  </p>

                  <button
                    onClick={() => handleOptIn(therapist.id)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                  >
                    Opt In & Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Therapists */}
        {activeTab === 'my-therapists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myTherapists.length > 0 ? (
              myTherapists.map(therapist => (
                <div key={therapist.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition">
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl">{therapist.avatar || '👨‍⚕️'}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">{therapist.name}</h3>
                      <p className="text-purple-600 text-sm font-semibold mb-2">
                        {therapist.specialization}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Last session: {therapist.last_session || 'No sessions yet'}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => openMessaging(therapist)}
                          className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                        >
                          💬 Message
                        </button>
                        <button
                          onClick={() => openBookingModal(therapist)}
                          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                          📅 Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">😊</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No Therapists Yet</h3>
                <p className="text-gray-600 mb-4">
                  Browse therapists and opt in to start your therapy journey!
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Browse Therapists
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Book Session with {selectedTherapist.name}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={bookingData.time}
                  onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Session Type
                </label>
                <select
                  value={bookingData.type}
                  onChange={(e) => setBookingData({...bookingData, type: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="in-person">In Person</option>
                  <option value="video-call">Video Call</option>
                  <option value="chat">Chat</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  rows="3"
                  placeholder="Any specific concerns or topics you'd like to discuss..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeBookingModal}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TherapySessions;
