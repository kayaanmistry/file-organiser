[Setup]
AppName=File Organiser
AppVersion={#Version}
DefaultDirName={autopf}\File Organiser
DefaultGroupName=File Organiser
PrivilegesRequired=lowest
OutputDir=dist
OutputBaseFilename=File-Organiser-Windows-Setup
UninstallDisplayIcon={app}\File Organiser.exe

[Tasks]
Name: desktopicon; Description: "Create a desktop shortcut"

[Files]
Source: "dist\File Organiser\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\File Organiser"; Filename: "{app}\File Organiser.exe"
Name: "{autodesktop}\File Organiser"; Filename: "{app}\File Organiser.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\File Organiser.exe"; Description: "Launch File Organiser"; Flags: postinstall nowait