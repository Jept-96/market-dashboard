$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Market Dashboard.lnk")
$Shortcut.TargetPath = "c:\Users\nykee\Desktop\dashboard\start-dashboard-kiosk.bat"
$Shortcut.WorkingDirectory = "c:\Users\nykee\Desktop\dashboard"
$Shortcut.WindowStyle = 7
$Shortcut.Description = "Market Dashboard Auto-Start"
$Shortcut.Save()
Write-Host "Startup shortcut created successfully!"
Write-Host "Location: $env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\Market Dashboard.lnk"
