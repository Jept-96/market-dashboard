@echo off
REM Market Dashboard Auto-Start Script
echo Starting Market Dashboard...

REM Change to dashboard directory
cd /d "%~dp0"

REM Start Node.js server
start /B node server/server.js

REM Wait 3 seconds for server to start
timeout /t 3 /nobreak > nul

REM Open dashboard in default browser (fullscreen on portable monitor)
start http://localhost:3000

echo Dashboard started successfully!
echo Server running at http://localhost:3000
echo.
echo To stop the server, close this window or press Ctrl+C
pause
