@echo off
echo ========================================
echo NeuraLife - Backend Starter
echo ========================================
echo.

cd backend

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
echo Backend will run at http://localhost:8000
echo API Docs at http://localhost:8000/docs
echo.

uvicorn app.main:app --reload
