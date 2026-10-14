@echo off
echo ========================================================
echo   CYBERTRACE-X: AI Cybercrime Investigation Framework
echo ========================================================
echo.
echo [1/2] Starting CyberTrace-X Core Server on port 5000...
cd server
start "CyberTrace-X Backend" cmd /c "node server.js"
timeout /t 2 >nul
echo.
echo [2/2] Opening CyberTrace-X in your default browser...
start http://localhost:5000
echo.
echo ========================================================
echo   CYBERTRACE-X IS READY AND RUNNING!
echo   Open in browser: http://localhost:5000
echo ========================================================
pause
