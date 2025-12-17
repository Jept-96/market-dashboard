@echo off
REM Quick sync script to push changes to GitHub

echo ========================================
echo   Syncing Dashboard to GitHub
echo ========================================
echo.

REM Check for changes
git status

echo.
echo Staging all changes...
git add .

echo.
set /p commit_msg="Enter commit message (or press Enter for 'Update dashboard'): "
if "%commit_msg%"=="" set commit_msg=Update dashboard

echo.
echo Committing changes...
git commit -m "%commit_msg%"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
echo   Sync Complete!
echo ========================================
echo.
pause
