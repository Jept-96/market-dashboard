@echo off
echo Stopping all Node.js servers...
taskkill /F /IM node.exe 2>nul

echo Waiting for processes to close...
timeout /t 2 /nobreak > nul

echo Starting dashboard server with updated forex rates...
cd /d "%~dp0"
node server/server.js

pause
