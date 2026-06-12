@echo off
echo ========================================
echo NeuraLife Premium Setup - All-in-One
echo ========================================
echo.
echo This will set up everything you need:
echo  1. Delete old database
echo  2. Create test users (test1-test6)
echo  3. Create therapists (8 professionals)
echo.
pause

cd backend

echo.
echo [1/3] Deleting old database...
if exist mental_health.db (
    del mental_health.db
    echo      Old database deleted
) else (
    echo      No old database found
)

echo.
echo [2/3] Creating test users...
python create_dummy_users.py

echo.
echo [3/3] Creating therapists...
python create_dummy_therapists.py

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo  1. Run: start_backend.bat
echo  2. Run: start_frontend.bat (in new terminal)
echo  3. Run: therapist-portal\start_portal.bat (in new terminal)
echo.
echo Then test:
echo  - User App: http://localhost:5173
echo    Login: test1 / 123456 (Premium)
echo    Click profile ^> "Go +" ^> Premium Dashboard
echo.
echo  - Therapist Portal: http://localhost:8080
echo    Login: sarah@neuralife.com / therapist123
echo.
pause
