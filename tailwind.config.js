<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token Refresher</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 100px auto;
            padding: 20px;
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .card {
            background: white;
            color: #333;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            transition: all 0.3s;
        }
        button:hover {
            background: #764ba2;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .status {
            margin: 20px 0;
            padding: 15px;
            border-radius: 8px;
            font-weight: bold;
        }
        .success {
            background: #10b981;
            color: white;
        }
        .warning {
            background: #f59e0b;
            color: white;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>🔄 Token Refresher</h1>
        <p>If you're seeing 401 Unauthorized errors, your login token has expired.</p>
        
        <div id="status"></div>
        
        <button onclick="clearAndRedirect()">🗑️ Clear Token & Go to Login</button>
        <button onclick="showStatus()">🔍 Check Current Status</button>
    </div>

    <script>
        function clearAndRedirect() {
            // Clear all tokens and user data
            localStorage.clear();
            sessionStorage.clear();
            
            document.getElementById('status').innerHTML = `
                <div class="status success">
                    ✅ All tokens cleared!<br>
                    Redirecting to login...
                </div>
            `;
            
            // Redirect to frontend after 1 second
            setTimeout(() => {
                window.location.href = 'http://localhost:5174';
            }, 1000);
        }

        function showStatus() {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            const darkMode = localStorage.getItem('darkMode');
            
            let html = '<div class="status">';
            
            if (token) {
                html += `
                    <div class="warning">
                        ⚠️ Token exists (may be expired)<br>
                        Username: ${username || 'Unknown'}<br>
                        Dark Mode: ${darkMode || 'false'}<br><br>
                        Click "Clear Token & Go to Login" to fix
                    </div>
                `;
            } else {
                html += `
                    <div class="success">
                        ✅ No token found<br>
                        You're ready to login fresh!
                    </div>
                `;
            }
            
            html += '</div>';
            document.getElementById('status').innerHTML = html;
        }

        // Check status on load
        window.onload = showStatus;
    </script>
</body>
</html>
