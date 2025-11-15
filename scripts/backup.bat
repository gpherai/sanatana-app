@echo off
REM Sanatana Kalender Backup Script (BAT version)
REM Roept PowerShell script aan

echo.
echo ====================================
echo   Sanatana Kalender Backup
echo ====================================
echo.

REM Check if PowerShell script exists
if not exist "%~dp0scripts\backup.ps1" (
    echo ERROR: scripts\backup.ps1 not found!
    pause
    exit /b 1
)

REM Run PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\backup.ps1"

echo.
pause
