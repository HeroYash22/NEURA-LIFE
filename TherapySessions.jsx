import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = 'http://localhost:8000';

function Resources({ setToken }) {
  const [activeTab, setActiveTab] = useState('music');
  const [data, setData] = useState([]);

  const tabs = [
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'meditation', label: 'Meditation', icon: '🧘' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'podcasts', label: 'Podcasts', icon: '🎙️' },
    { id: 'videos', label: 'Videos', icon: '🎥' }
  ];

  useEffect(() => {
    fetchResources();
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/resources/${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const key = Object.keys(response.data)[0];
      setData(response.data[key]);
    } catch (err) {
      console.error('Error fetching resources:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar setToken={setToken} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 transition-colors duration-300">Resources 📚</h1>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(item => (
            <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{item.title}</h3>
              
              {item.author && (
                <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">by {item.author}</p>
              )}
              
              {item.host && (
                <p className="text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">Host: {item.host}</p>
              )}
              
              {item.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 transition-colors duration-300">{item.description}</p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-3">
                {item.duration && (
                  <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    ⏱️ {item.duration}
                  </span>
                )}
                
                {item.difficulty && (
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                    📊 {item.difficulty}
                  </span>
                )}
              </div>
              
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-4 bg-indigo-600 text-white text-center py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Access Resource →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Resources;
