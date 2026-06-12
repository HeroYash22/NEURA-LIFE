<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuraLife - Therapist Portal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
    <!-- Navbar -->
    <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <span class="text-2xl font-bold text-white">👨‍⚕️ NeuraLife Therapist Portal</span>
                </div>
                <div class="flex items-center space-x-4">
                    <span id="therapist-name" class="text-white font-semibold"></span>
                    <button onclick="logout()" class="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Login Section -->
        <div id="login-section" class="max-w-md mx-auto">
            <div class="bg-white rounded-2xl shadow-2xl p-8">
                <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Therapist Login</h2>
                <form onsubmit="handleLogin(event)">
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                            type="email" 
                            id="login-email" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            placeholder="therapist@neuralife.com"
                        />
                    </div>
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            id="login-password" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            placeholder="Enter password"
                        />
                    </div>
                    <button type="submit" class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition">
                        Login
                    </button>
                </form>
                <p class="text-sm text-gray-600 mt-4 text-center">
                    Test login: Any therapist email / 123456<br>
                    <span class="text-xs">(e.g., liban@neuralife.com / 123456)</span>
                </p>
            </div>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboard-section" class="hidden">
            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Total Patients</p>
                            <p id="total-patients" class="text-3xl font-bold text-indigo-600">0</p>
                        </div>
                        <div class="text-4xl">👥</div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Unread Messages</p>
                            <p id="unread-messages" class="text-3xl font-bold text-purple-600">0</p>
                        </div>
                        <div class="text-4xl">💬</div>
                    </div>
                </div>
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-600 text-sm">Pending Requests</p>
                            <p id="pending-requests" class="text-3xl font-bold text-yellow-600">0</p>
                        </div>
                        <div class="text-4xl">⏳</div>
                    </div>
                </div>
            </div>

            <!-- Pending Appointments Section -->
            <div id="pending-appointments-section" class="bg-white rounded-2xl shadow-2xl p-8 mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">⏳ Pending Appointment Requests</h2>
                <div id="pending-appointments-list" class="space-y-4">
                    <!-- Pending appointments will be loaded here -->
                </div>
            </div>

            <!-- Patients List -->
            <div class="bg-white rounded-2xl shadow-2xl p-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-6">My Patients</h2>
                <div id="patients-list" class="space-y-4">
                    <!-- Patients will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Chat Section -->
        <div id="chat-section" class="hidden">
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden" style="height: calc(100vh - 200px);">
                <!-- Chat Header -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <button onclick="backToDashboard()" class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                            ←
                        </button>
                        <div>
                            <h3 id="chat-patient-name" class="text-xl font-bold text-white"></h3>
                            <p class="text-purple-200 text-sm">Patient</p>
                        </div>
                    </div>
                </div>

                <!-- Messages -->
                <div id="chat-messages" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50" style="height: calc(100% - 180px);">
                    <!-- Messages will be loaded here -->
                </div>

                <!-- Message Input -->
                <form onsubmit="sendMessage(event)" class="border-t border-gray-200 p-4 bg-white">
                    <div class="flex gap-3">
                        <input 
                            type="text" 
                            id="message-input" 
                            placeholder="Type your message..." 
                            class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                        <button type="submit" class="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
                            Send 📤
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="app.jsx"></script>
</body>
</html>
