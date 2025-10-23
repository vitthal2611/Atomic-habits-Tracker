@echo off
echo ========================================
echo   ATOMIC HABITS TRACKER - PRODUCTION
echo ========================================
echo.

echo [1/4] Cleaning previous build...
if exist build rmdir /s /q build
echo Done.
echo.

echo [2/4] Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b %errorlevel%
)
echo Done.
echo.

echo [3/4] Deploying to Firebase Hosting...
call firebase deploy --only hosting
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed!
    pause
    exit /b %errorlevel%
)
echo Done.
echo.

echo ========================================
echo   DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is now live at:
echo https://atomic-habits-tracker-b6e48.web.app
echo.
pause
