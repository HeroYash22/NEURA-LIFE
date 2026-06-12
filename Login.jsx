import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = 'http://localhost:8000';

function Chatbot({ setToken }) {
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadSessions();
    
    // Check if we were navigated here with a specific session ID (e.g., from Quiz)
    if (location.state?.sessionId) {
      setCurrentSessionId(location.state.sessionId);
      loadSession(location.state.sessionId);
    }
  }, [location.state]);

  const loadSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/chatbot/sessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Sort sessions by updated_at in descending order (newest first)
      const sortedSessions = response.data.sessions.sort((a, b) => 
        new Date(b.updated_at) - new Date(a.updated_at)
      );
      
      setSessions(sortedSessions);
      
      // Don't auto-load any session - let user start fresh or choose from sidebar
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/chatbot/history/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCurrentSessionId(sessionId);
      
      // Format messages for display
      const formattedMessages = [];
      response.data.history.forEach(msg => {
        formattedMessages.push({ role: 'user', content: msg.message });
        formattedMessages.push({ role: 'bot', content: msg.response });
      });
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error loading session:', err);
    }
  };

  const createNewSession = async () => {
    // Clear current session and messages to show welcome screen
    setCurrentSessionId(null);
    setMessages([]);
    setInput('');
  };

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_URL}/api/chatbot/sessions/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // If deleted session is current, clear it
      if (sessionId === currentSessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      
      // Reload sessions
      loadSessions();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    
    // If no session exists, create one first
    if (!currentSessionId) {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${API_URL}/api/chatbot/sessions`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const newSessionId = response.data.session_id;
        setCurrentSessionId(newSessionId);
        
        // Now send the message with the new session
        await sendMessageToSession(userMessage, newSessionId, token);
        
        // Reload sessions list
        setTimeout(() => {
          loadSessions();
        }, 300);
      } catch (err) {
        console.error('Error creating session:', err);
        setLoading(false);
      }
    } else {
      // Session exists, just send the message
      setLoading(true);
      const token = localStorage.getItem('token');
      await sendMessageToSession(userMessage, currentSessionId, token);
      
      // Reload sessions to update titles with a small delay to ensure backend has updated
      setTimeout(() => {
        loadSessions();
      }, 300);
    }
  };

  const sendMessageToSession = async (userMessage, sessionId, token) => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await axios.post(
        `${API_URL}/api/chatbot/message`,
        { 
          message: userMessage,
          session_id: sessionId
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: 'bot', content: response.data.response }]);
    } catch (err) {
      console.error('Error sending message:', err);
      // Prefer backend-provided error detail when available
      const backendMsg = err?.response?.data?.detail || err?.message || 'Unknown error';
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `Sorry, I encountered an error: ${backendMsg}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar setToken={setToken} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'w-64' : 'w-0'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}>
          <div className="p-4 space-y-3">
            <button
              onClick={createNewSession}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>
            
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-2 pt-2 transition-colors duration-300">
              Recent Conversations
            </div>
            
            <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  onClick={() => loadSession(session.session_id)}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition group flex items-start justify-between ${
                    currentSessionId === session.session_id ? 'bg-gray-100 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate transition-colors duration-300">
                      {session.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteSession(session.session_id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-3 transition-colors duration-300">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">AI Support Chatbot 💬</h1>
          </div>

          <div className={`flex-1 ${messages.length === 0 ? 'overflow-hidden' : 'overflow-y-auto'} p-6 space-y-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <div className="max-w-3xl w-full space-y-6">
                  {/* Welcome Header */}
                  <div className="text-center">
                    <div className="text-5xl mb-3 mt-3">🎀✨</div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                      Welcome to NeuraLife AI Assistant
                    </h2>
                    <p className="text-base text-gray-600 dark:text-gray-300 transition-colors duration-300">
                      Your compassionate mental health companion. Share your thoughts, feelings, or concerns, and I'll provide support and coping strategies.
                    </p>
                  </div>

                  {/* Example Prompts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-4">
                    <button
                      onClick={() => setInput("I'm feeling anxious and overwhelmed. Can you help me?")}
                      className="p-3 text-left bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">😰</span>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm transition-colors duration-300">Feeling Anxious</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Get help managing anxiety and overwhelming feelings</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setInput("I'm having trouble sleeping lately. What can I do?")}
                      className="p-3 text-left bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">😴</span>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm transition-colors duration-300">Sleep Issues</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Learn techniques for better sleep</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setInput("I've been feeling down and unmotivated recently.")}
                      className="p-3 text-left bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">😔</span>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm transition-colors duration-300">Low Mood</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Explore strategies to lift your spirits</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setInput("Can you teach me some stress management techniques?")}
                      className="p-3 text-left bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-300 group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">🧘</span>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-gray-100 mb-1 text-sm transition-colors duration-300">Stress Relief</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">Discover effective coping mechanisms</div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mx-4 transition-colors duration-300">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">💡</span>
                      <div className="text-xs text-blue-800 dark:text-blue-300 transition-colors duration-300">
                        <strong>Remember:</strong> This AI provides supportive guidance but is not a replacement for professional mental health care. If you're in crisis, please call <strong>1800-599-0019</strong> or contact emergency services.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-600 shadow-sm transition-colors duration-300'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-colors duration-300">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-colors duration-300">
            <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Send
                </button>
              </div>
            </form>
            
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <strong>Note:</strong> This chatbot provides general support. For immediate help in a crisis, please call 1800-599-0019 or contact emergency services.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;