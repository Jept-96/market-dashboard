@echo off
REM Quick update script to pull latest changes from GitHub

echo ========================================
echo   Updating Dashboard from GitHub
echo ========================================
echo.

echo Fetching latest changes...
git pull

echo.
echo ========================================
echo   Update Complete!
echo ========================================
echo.
echo The dashboard now has the latest changes.
echo You can start the server with: start-dashboard.bat
echo.
pause
