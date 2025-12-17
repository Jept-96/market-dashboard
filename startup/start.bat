@echo off
REM Auxiliary Dashboard Auto-Start Script

REM Change to dashboard directory
cd /d "%~dp0.."

REM Start Node.js server in background
echo Starting dashboard server...
start /B node server/server.js

REM Wait for server to initialize
timeout /t 3 /nobreak >nul

REM Open dashboard in Chrome app mode (borderless window)
echo Opening dashboard...
start chrome --app=http://localhost:3000 --window-size=1920,600 --window-position=0,0

REM Alternative: Use Microsoft Edge if Chrome is not available
REM start msedge --app=http://localhost:3000 --window-size=1920,600 --window-position=0,0

echo Dashboard started!
echo.
echo To access configuration page: http://localhost:3000/config
echo.
pause
