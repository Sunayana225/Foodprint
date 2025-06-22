@echo off
echo Stopping any running development servers...
taskkill /f /im node.exe 2>nul

echo Clearing npm cache...
npm cache clean --force

echo Starting optimized development server...
set VITE_FIREBASE_DEBUG=false
set VITE_PERFORMANCE_MONITOR=false
npm run dev

pause
