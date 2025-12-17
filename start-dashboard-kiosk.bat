@echo off
REM Market Dashboard Auto-Start Script (Kiosk Mode)
echo Starting Market Dashboard in Kiosk Mode...

REM Change to dashboard directory
cd /d "%~dp0"

REM Start Node.js server in background
start /B node server/server.js

REM Wait 3 seconds for server to start
timeout /t 3 /nobreak > nul

REM Open dashboard in Chrome Kiosk Mode (fullscreen, no toolbars)
REM Chrome will open on the last active monitor (your portable monitor)
start chrome --kiosk --app=http://localhost:3000

echo Dashboard started in kiosk mode!
echo Server running at http://localhost:3000
echo.
echo To exit kiosk mode, press Alt+F4
echo To stop the server, use Task Manager to end node.exe process
pause
