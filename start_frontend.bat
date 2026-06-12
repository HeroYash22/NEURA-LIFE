@echo off
echo ========================================
echo NeuraLife - Frontend Starter
echo ========================================
echo.

cd frontend

echo Installing dependencies...
call npm install

echo.
echo Starting React development server...
echo Frontend will run at http://localhost:5173
echo.

call npm run dev
