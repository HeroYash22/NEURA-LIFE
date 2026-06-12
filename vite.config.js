<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Dark Mode</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        button {
            background: #6366f1;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
        }
        button:hover {
            background: #4f46e5;
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            background: #e0e7ff;
            border-radius: 6px;
            border-left: 4px solid #6366f1;
        }
        .success {
            background: #d1fae5;
            border-left-color: #10b981;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌙 Dark Mode Reset Tool</h1>
        <p>Use this page to reset your dark mode settings if stuck.</p>
        
        <div id="status" class="status">
            Current dark mode setting: <strong id="current">Loading...</strong>
        </div>
        
        <button onclick="setLightMode()">☀️ Force Light Mode</button>
        <button onclick="setDarkMode()">🌙 Force Dark Mode</button>
        <button onclick="clearSetting()">🗑️ Clear Setting</button>
        
        <hr style="margin: 30px 0;">
        
        <h3>Debugging Info:</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 14px;">
            <div>localStorage.darkMode: <strong id="stored">-</strong></div>
            <div>document.documentElement has 'dark' class: <strong id="hasClass">-</strong></div>
        </div>
        
        <button onclick="goToApp()" style="margin-top: 20px; background: #10b981;">
            ✅ Go to NeuraLife App
        </button>
    </div>

    <script>
        function updateStatus() {
            const darkMode = localStorage.getItem('darkMode');
            const hasDarkClass = document.documentElement.classList.contains('dark');
            
            document.getElementById('current').textContent = darkMode || 'not set';
            document.getElementById('stored').textContent = darkMode || 'null';
            document.getElementById('hasClass').textContent = hasDarkClass ? 'YES' : 'NO';
        }

        function setLightMode() {
            localStorage.setItem('darkMode', 'false');
            document.documentElement.classList.remove('dark');
            document.getElementById('status').className = 'status success';
            document.getElementById('status').innerHTML = '✅ Set to LIGHT MODE. Refresh the NeuraLife app to see changes.';
            updateStatus();
        }

        function setDarkMode() {
            localStorage.setItem('darkMode', 'true');
            document.documentElement.classList.add('dark');
            document.getElementById('status').className = 'status success';
            document.getElementById('status').innerHTML = '✅ Set to DARK MODE. Refresh the NeuraLife app to see changes.';
            updateStatus();
        }

        function clearSetting() {
            localStorage.removeItem('darkMode');
            document.documentElement.classList.remove('dark');
            document.getElementById('status').className = 'status success';
            document.getElementById('status').innerHTML = '✅ CLEARED setting. App will default to LIGHT MODE.';
            updateStatus();
        }

        function goToApp() {
            window.location.href = 'http://localhost:5173';
        }

        // Initial update
        updateStatus();
    </script>
</body>
</html>
