import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = 'http://localhost:8000';

function Quiz({ setToken }) {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [creatingChatSession, setCreatingChatSession] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/quiz/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.quizzes);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    }
  };

  const startQuiz = async (quizId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentQuiz(response.data);
      setSelectedQuiz(quizId);
      setAnswers(new Array(response.data.questions.length).fill(null));
      setResult(null);
    } catch (err) {
      console.error('Error fetching quiz:', err);
    }
  };

  const submitQuiz = async () => {
    if (answers.some(a => a === null)) {
      alert('Please answer all questions');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/quiz/${selectedQuiz}/submit`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(response.data);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuiz(null);
    setAnswers([]);
    setResult(null);
  };

  const discussWithAI = async () => {
    setCreatingChatSession(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create a new chat session
      const sessionResponse = await axios.post(
        `${API_URL}/api/chatbot/sessions`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const sessionId = sessionResponse.data.session_id;
      
      // Determine max score based on quiz type
      let maxScore = 27; // default for PHQ-9
      if (selectedQuiz === 'gad7') {
        maxScore = 21;
      } else if (selectedQuiz === 'pss10') {
        maxScore = 40;
      }
      
      // Prepare the assessment summary message
      const assessmentMessage = `I just completed a ${currentQuiz.title} and got the following results:

📊 Score: ${result.score}/${maxScore}
📋 Result: ${result.result}

Assessment Type: ${currentQuiz.title}
Total Questions: ${currentQuiz.questions.length}

Based on these results, can you:
1. Help me understand what this means for my mental health
2. Provide evidence-based coping strategies
3. Suggest lifestyle changes or practices that might help
4. Let me know if I should consider seeking professional help

I'd appreciate your support and guidance.`;

      // Send the initial message to the chatbot
      await axios.post(
        `${API_URL}/api/chatbot/message`,
        { 
          message: assessmentMessage,
          session_id: sessionId 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Navigate to chatbot with the session ID
      navigate('/chatbot', { state: { sessionId } });
      
    } catch (err) {
      console.error('Error creating chat session:', err);
      alert('Failed to start chat session. Please try again.');
    } finally {
      setCreatingChatSession(false);
    }
  };

  if (result) {
    // Determine severity color and max score based on quiz type
    let maxScore = 27;
    let severityColor = 'text-indigo-600';
    let severityBg = 'bg-indigo-50';
    let severityBorder = 'border-indigo-200';
    
    if (selectedQuiz === 'phq9') {
      maxScore = 27;
      if (result.score >= 20) severityColor = 'text-red-600';
      else if (result.score >= 15) severityColor = 'text-orange-600';
      else if (result.score >= 10) severityColor = 'text-yellow-600';
      else if (result.score >= 5) severityColor = 'text-blue-600';
    } else if (selectedQuiz === 'gad7') {
      maxScore = 21;
      if (result.score >= 15) severityColor = 'text-red-600';
      else if (result.score >= 10) severityColor = 'text-orange-600';
      else if (result.score >= 5) severityColor = 'text-yellow-600';
    } else if (selectedQuiz === 'pss10') {
      maxScore = 40;
      if (result.score >= 27) severityColor = 'text-red-600';
      else if (result.score >= 14) severityColor = 'text-yellow-600';
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navbar setToken={setToken} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📊</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Assessment Complete!</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className={`text-5xl font-bold ${severityColor}`}>
                    {result.score}
                  </div>
                  <div className="text-2xl text-gray-400 font-light">
                    / {maxScore}
                  </div>
                </div>
                
                {result.severity && (
                  <div className={`inline-block px-4 py-2 rounded-full ${severityBg} ${severityBorder} border-2 mb-3`}>
                    <span className={`font-bold ${severityColor}`}>
                      {result.severity}
                    </span>
                  </div>
                )}
                
                <p className="text-lg text-gray-700 mb-2 max-w-2xl mx-auto">{result.result}</p>
                <p className="text-sm text-gray-500">Assessment: {currentQuiz.title}</p>
              </div>

              {/* Score Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 mb-2 font-semibold">Score Range Reference:</div>
                <div className="flex justify-center gap-2 flex-wrap">
                  {selectedQuiz === 'phq9' && (
                    <>
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">0-4: Minimal</span>
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">5-9: Mild</span>
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">10-14: Moderate</span>
                      <span className="text-xs px-3 py-1 bg-orange-100 text-orange-700 rounded-full">15-19: Mod. Severe</span>
                      <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">20-27: Severe</span>
                    </>
                  )}
                  {selectedQuiz === 'gad7' && (
                    <>
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">0-4: Minimal</span>
                      <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">5-9: Mild</span>
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">10-14: Moderate</span>
                      <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">15-21: Severe</span>
                    </>
                  )}
                  {selectedQuiz === 'pss10' && (
                    <>
                      <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">0-13: Low</span>
                      <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">14-26: Moderate</span>
                      <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">27-40: High</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Important:</strong> This is a standardized screening tool used by healthcare professionals. However, results are for informational purposes only and do not constitute a diagnosis. Please consult a mental health professional for proper assessment and treatment.
              </p>
            </div>

            {/* Next Steps Section */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">What would you like to do next?</h3>
              
              <div className="space-y-3">
                {/* Discuss with AI - Primary Action */}
                <button
                  onClick={discussWithAI}
                  disabled={creatingChatSession}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    <div className="text-left">
                      <div className="font-bold">Discuss Results with AI Assistant</div>
                      <div className="text-sm text-indigo-100">
                        {creatingChatSession ? 'Creating chat session...' : 'Get personalized coping strategies and evidence-based support'}
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* View Resources */}
                <button
                  onClick={() => navigate('/resources')}
                  className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <div className="text-left">
                      <div className="font-bold text-gray-800">Explore Wellness Resources</div>
                      <div className="text-sm text-gray-600">Find helpful content and mental health tools</div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Take Another Quiz */}
                <button
                  onClick={resetQuiz}
                  className="w-full flex items-center justify-between p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📝</span>
                    <div className="text-left">
                      <div className="font-bold text-gray-800">Take Another Assessment</div>
                      <div className="text-sm text-gray-600">Explore other clinical screening tools</div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Crisis Resources */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🆘</span>
                <div>
                  <h4 className="font-bold text-red-900 mb-1">In Crisis?</h4>
                  <p className="text-red-800 text-sm mb-2">If you're experiencing a mental health emergency or having thoughts of self-harm:</p>
                  <div className="text-red-900 text-sm space-y-1">
                    <div>📞 Call <a href="tel:1800-599-0019" className="underline font-semibold hover:text-red-700">1800-599-0019</a> (Suicide & Crisis Lifeline) - Available 24/7</div>
                    <div>💬 Text <strong>HOME</strong> to <strong>741741</strong> (Crisis Text Line)</div>
                    <div>🏥 Visit your nearest emergency room</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    const progress = (answers.filter(a => a !== null).length / currentQuiz.questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Navbar setToken={setToken} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <button
              onClick={resetQuiz}
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Assessments
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {answers.filter(a => a !== null).length} of {currentQuiz.questions.length}
              </span>
              <span className="text-sm font-medium text-indigo-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{currentQuiz.title}</h2>
              <p className="text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                📋 {currentQuiz.description}
              </p>
            </div>

            <div className="space-y-8">
              {currentQuiz.questions.map((q, qIndex) => (
                <div key={q.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-indigo-200 transition">
                  <div className="flex items-start mb-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {qIndex + 1}
                    </span>
                    <p className="font-medium text-gray-800 text-lg pt-1">
                      {q.question}
                    </p>
                  </div>

                  <div className="space-y-2 ml-11">
                    {q.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                          answers[qIndex] === oIndex
                            ? 'border-indigo-600 bg-indigo-50 shadow-md'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={answers[qIndex] === oIndex}
                          onChange={() => {
                            const newAnswers = [...answers];
                            newAnswers[qIndex] = oIndex;
                            setAnswers(newAnswers);
                          }}
                          className="mr-3 w-5 h-5 text-indigo-600"
                        />
                        <span className={`text-base ${answers[qIndex] === oIndex ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {answers.filter(a => a !== null).length === currentQuiz.questions.length ? (
                  <span className="text-green-600 font-semibold flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    All questions answered
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    Please answer all questions
                  </span>
                )}
              </div>
              
              <button
                onClick={submitQuiz}
                disabled={answers.some(a => a === null)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600"
              >
                Submit Assessment
              </button>
            </div>
          </div>

          {/* Confidentiality Notice */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <span className="text-xl mr-2">🔒</span>
              <p className="text-sm text-green-800">
                <strong>Your privacy matters:</strong> Your responses are confidential and stored securely. Results are only visible to you.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar setToken={setToken} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Clinical Mental Health Assessments 🏥</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Take standardized, evidence-based screening tools used by healthcare professionals worldwide. 
            These assessments provide insights into your mental well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">
                  {quiz.id === 'phq9' && '😔'}
                  {quiz.id === 'gad7' && '😰'}
                  {quiz.id === 'pss10' && '😓'}
                </div>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-semibold transition-colors duration-300">
                  {quiz.questions} questions
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{quiz.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 h-12 transition-colors duration-300">{quiz.description}</p>
              
              <div className="mb-4 text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                <div className="flex items-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span>~5 minutes</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Clinically validated</span>
                </div>
              </div>
              
              <button
                onClick={() => startQuiz(quiz.id)}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium shadow-md"
              >
                Start Assessment
              </button>
            </div>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <span className="text-3xl mr-3">📋</span>
              <div>
                <h3 className="font-bold text-blue-900 mb-2">About These Assessments</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>PHQ-9:</strong> Widely used depression screening tool (0-27 scale)</li>
                  <li>• <strong>GAD-7:</strong> Standard anxiety disorder assessment (0-21 scale)</li>
                  <li>• <strong>PSS-10:</strong> Measures perceived stress levels (0-40 scale)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-start">
              <span className="text-3xl mr-3">✅</span>
              <div>
                <h3 className="font-bold text-green-900 mb-2">Why Use Standardized Tools?</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Evidence-based and clinically validated</li>
                  <li>• Used by healthcare professionals worldwide</li>
                  <li>• Consistent and reliable measurements</li>
                  <li>• Track your progress over time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
          <div className="flex items-start">
            <span className="text-3xl mr-3">⚠️</span>
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-800 text-sm">
                These assessments are <strong>screening tools</strong>, not diagnostic instruments. 
                They provide valuable insights but <strong>do not replace professional evaluation</strong>. 
                If you're experiencing mental health concerns, please consult a qualified healthcare provider or mental health professional.
                For immediate crisis support, call <strong>1800-599-0019</strong> (Suicide & Crisis Lifeline).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
