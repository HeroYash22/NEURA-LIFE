# NeuraLife 🧠

A comprehensive mental wellness support application with user authentication, resources, chatbot, and mental health assessments.

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLite Database
- JWT Authentication
- Pydantic for validation

**Frontend:**
- React 18
- Tailwind CSS
- Axios for API calls
- React Router for navigation

## Project Structure

```
NIT/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app with all endpoints
│   │   ├── models.py            # Database models (User, Therapist, etc.)
│   │   ├── auth.py              # JWT authentication logic
│   │   └── database.py          # Database connection
│   ├── create_dummy_users.py    # Script to create test users
│   ├── create_dummy_therapists.py # Script to create test therapists
│   ├── requirements.txt
│   ├── run.py                   # Backend entry point
│   └── mental_health.db         # SQLite database (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Main navigation with profile dropdown
│   │   │   ├── PremiumNavbar.jsx    # Premium user navigation
│   │   │   ├── Login.jsx            # Login/Register page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   ├── PremiumDashboard.jsx # Premium user dashboard
│   │   │   ├── Premium.jsx          # NeuraLife+ purchase page
│   │   │   ├── Resources.jsx        # Mental health resources
│   │   │   ├── Chatbot.jsx          # AI chatbot
│   │   │   ├── Quiz.jsx             # Mental health assessments
│   │   │   ├── PremiumCalendar.jsx  # Therapy session calendar
│   │   │   ├── TherapySessions.jsx  # Browse & manage therapists
│   │   │   └── TherapyChat.jsx      # Real-time messaging
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
├── therapist-portal/
│   ├── index.html           # Therapist webapp UI
│   ├── app.jsx               # Therapist portal logic
│   ├── server.py            # Python HTTP server (port 8080)
│   └── start_portal.bat     # Startup script
├── start_backend.bat        # Backend startup script
├── start_frontend.bat       # Frontend startup script
└── README.md
```

## Features

### 1. Authentication ✅
- User registration with username/email/password
- Login with JWT tokens
- **Google OAuth Sign-In** 🆕 - One-click sign in with Google account
- Protected routes
- Profile dropdown with avatar

### 2. Free User Features 🆓
- **Dashboard** - Welcome screen with navigation
- **Resources** - 60+ curated mental health resources
  - Music playlists (Spotify links)
  - Guided meditation (YouTube)
  - Recommended books (Amazon)
  - Mental health podcasts
  - Educational videos
- **AI Chatbot** - Mental health support with conversation history
- **Quizzes** - Anxiety, depression, and stress assessments
- **NeuraCoins** - Virtual currency system (5000 coins to start)

### 3. Premium Features ⭐ (NeuraLife+)
- **Premium Dashboard** - Enhanced interface with stats
- **Calendar** - Schedule and view therapy sessions
- **Therapy Sessions** - Browse 10 professional therapists
- **Real-time Messaging** - Chat with therapists
- **Therapist Profiles** - View credentials, experience, ratings
- **Opt-in System** - Connect with multiple therapists
- **Cost**: 1000 NeuraCoins

### 4. Therapist Portal 👨‍⚕️
- **Separate Web Interface** (localhost:8080)
- **Patient Management** - View all connected users
- **Bidirectional Messaging** - Reply to patient messages
- **Dashboard Stats** - Patients, messages, sessions
- **Professional Profiles** - Specialization, credentials, bio

## Quick Start

### 🚀 Running from Scratch

**Prerequisites:**
- Python 3.8+
- Node.js 16+
- npm or yarn

### 1️⃣ Backend Setup (Port 8000)

```powershell
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create dummy users and therapists (first time only)
python create_dummy_users.py
python create_dummy_therapists.py

# Start the backend server
python run.py
```

The backend will be available at: `http://localhost:8000`

**Test Users:**
- Premium User: `test1` / `123456`
- Free Users: `test2`, `test3`, `test4`, `test5`, `test6` / `123456`

**Test Therapists:**
- `ritvik@neuralife.com` / `123456`
- `liban@neuralife.com` / `123456`
- `yash@neuralife.com` / `123456`
- `abhisaar@neuralife.com` / `123456`
- `t1@neuralife.com` to `t6@neuralife.com` / `123456`

### 2️⃣ User Frontend Setup (Port 5173)

```powershell
# Open a new terminal
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The user app will be available at: `http://localhost:5173`

### 3️⃣ Therapist Portal Setup (Port 8080)

```powershell
# Open a new terminal
cd therapist-portal

# Start the therapist portal server
python server.py
```

The therapist portal will be available at: `http://localhost:8080`

### 🎯 All-in-One Startup (Windows)

You can also use the provided batch files:

```powershell
# Start backend
.\start_backend.bat

# Start user frontend (in new terminal)
.\start_frontend.bat

# Start therapist portal (in new terminal)
cd therapist-portal
.\start_portal.bat
```

### 📝 Important Notes

- **All three servers must be running** for full functionality
- Backend must start **first** before frontend and therapist portal
- If you encounter database errors, delete `backend/mental_health.db` and run the dummy data scripts again
- Default ports: Backend (8000), User App (5173), Therapist Portal (8080)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google/login` - Initiate Google OAuth login 🆕
- `GET /api/auth/google/callback` - Handle Google OAuth callback 🆕
- `GET /api/auth/me` - Get current user (with premium status)

### Resources
- `GET /api/resources/music` - Get music playlists (12 items)
- `GET /api/resources/meditation` - Get meditation guides (12 items)
- `GET /api/resources/books` - Get recommended books (12 items)
- `GET /api/resources/podcasts` - Get podcasts (12 items)
- `GET /api/resources/videos` - Get videos (12 items)

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/history` - Get chat history

### Quiz
- `GET /api/quiz/list` - Get available quizzes
- `GET /api/quiz/{id}` - Get specific quiz
- `POST /api/quiz/{id}/submit` - Submit quiz answers
- `GET /api/quiz/results/{id}` - Get quiz results

### Premium
- `POST /api/premium/purchase` - Purchase NeuraLife+ (1000 coins)

### Therapy (Premium Users)
- `GET /api/therapy/therapists` - Get all therapists
- `POST /api/therapy/opt-in` - Connect with a therapist
- `GET /api/therapy/my-therapists` - Get user's therapists
- `GET /api/therapy/messages/{therapist_id}` - Get messages with therapist
- `POST /api/therapy/send-message` - Send message to therapist
- `GET /api/therapy/sessions` - Get user's therapy sessions

### Therapist Portal
- `POST /api/therapist/login` - Therapist authentication
- `GET /api/therapist/patients` - Get therapist's patients
- `GET /api/therapist/messages/{user_id}` - Get messages with patient
- `POST /api/therapist/send-message` - Send message to patient

## Environment Variables

**Backend (.env):**
```
DATABASE_URL=sqlite:///./mental_health.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth (NEW - See OAUTH_README.md for setup)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### 🔐 Google OAuth Setup

Your app now supports **Google OAuth authentication**! Users can sign in with Google.

**📖 Complete Setup Guide:** See `OAUTH_README.md` or `QUICK_REFERENCE.md`

**Quick Steps:**
1. Get OAuth credentials from Google Cloud Console
2. Add to `backend/.env`
3. Restart backend
4. Test at http://localhost:5173

**Files:**
- `QUICK_REFERENCE.md` - 5-minute quick start
- `GOOGLE_OAUTH_SETUP.md` - Detailed setup steps
- `OAUTH_SETUP_GUIDE.md` - Complete integration guide
- `OAUTH_README.md` - Overview and documentation index

## Development Status

- [x] Project structure created
- [x] Backend with FastAPI
- [x] Frontend with React + Tailwind
- [x] User authentication (JWT)
- [x] Resources library (60+ items with real links)
- [x] AI Chatbot integration
- [x] Mental health quiz system
- [x] Premium subscription system
- [x] NeuraCoins virtual currency
- [x] Therapy session management
- [x] Real-time messaging (polling-based)
- [x] Therapist portal (separate webapp)
- [x] Profile dropdown with premium status
- [x] Calendar for therapy sessions
- [ ] Video call integration
- [ ] Mobile app (PWA conversion recommended)
- [ ] Payment gateway integration

## Troubleshooting

### Database Issues
If you encounter login errors or database-related problems:

```powershell
# Stop the backend server (Ctrl+C)
cd backend
Remove-Item mental_health.db
python create_dummy_users.py
python create_dummy_therapists.py
python run.py
```

### Port Already in Use
If ports 8000, 5173, or 8080 are already in use:
- Check for existing processes: `netstat -ano | findstr :<port>`
- Kill the process: `taskkill /PID <process_id> /F`

### CORS Errors
The backend is configured to allow:
- User Frontend: `http://localhost:5173`
- Therapist Portal: `http://localhost:8080`

If you change ports, update `backend/app/main.py` CORS settings.

## Tech Stack Details

**Backend:**
- FastAPI (modern Python web framework)
- SQLite (database)
- JWT authentication
- Uvicorn server
- SQLAlchemy ORM

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- Axios for API calls
- React Router DOM for navigation

**Therapist Portal:**
- Vanilla HTML/CSS/JavaScript
- Python SimpleHTTPServer
- Fetch API for backend communication

## License

MIT
