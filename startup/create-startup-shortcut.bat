@echo off
REM Creates a Windows startup shortcut for the Market Dashboard

echo Creating Windows startup shortcut...
echo.

REM Run the VBScript to create the shortcut
cscript //NoLogo "%~dp0CreateStartupShortcut.vbs"

echo.
echo The dashboard will now automatically start when Windows boots.
echo.
pause
