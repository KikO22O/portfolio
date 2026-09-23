@echo off
setlocal

cd /d "%~dp0"
set "DISABLE_HMR=false"

if not exist "node_modules" (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting the latest local version...
start "Kiko's Portfolio Dev Server" /D "%~dp0" cmd /k npm run dev

timeout /t 3 /nobreak >nul
start "" "http://localhost:3000"

endlocal
