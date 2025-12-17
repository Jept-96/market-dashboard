Set WshShell = CreateObject("WScript.Shell")
StartupFolder = WshShell.SpecialFolders("Startup")
Set Shortcut = WshShell.CreateShortcut(StartupFolder & "\Market Dashboard.lnk")
Shortcut.TargetPath = "c:\Users\nykee\Desktop\dashboard\start-dashboard-kiosk.bat"
Shortcut.WorkingDirectory = "c:\Users\nykee\Desktop\dashboard"
Shortcut.WindowStyle = 7
Shortcut.Description = "Market Dashboard Auto-Start"
Shortcut.Save
WScript.Echo "Startup shortcut created at: " & StartupFolder & "\Market Dashboard.lnk"
