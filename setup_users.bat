@echo off
echo ========================================
echo NeuraLife - Setup Dummy Users
echo ========================================
echo.
echo Creating 6 test users:
echo   - test1 (Premium) - 5000 NeuraCoins
echo   - test2 to test6 (Free) - 5000 NeuraCoins each
echo   - All passwords: 123456
echo.

cd backend
python create_dummy_users.py

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo You can now login with:
echo   - test1 / 123456 (Premium User - See "Go +" button)
echo   - test2 / 123456 (Free User - See "Buy NeuraLife+" button)
echo   - test3-test6 / 123456 (All Free Users)
echo.
pause
