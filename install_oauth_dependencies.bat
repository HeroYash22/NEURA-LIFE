@echo off
echo Installing Google OAuth dependencies...
cd backend
pip install authlib httpx
echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Follow the instructions in GOOGLE_OAUTH_SETUP.md to get your OAuth credentials
echo 2. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to backend/.env
echo 3. Restart the backend server
echo.
pause
