@echo off
echo ========================================
echo   ATOMIC HABITS - FIREBASE DEPLOYMENT
echo ========================================
echo.

echo Step 1: Building production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo Build failed! Fix errors and try again.
    pause
    exit /b %errorlevel%
)
echo ✓ Build successful!
echo.

echo Step 2: Deploying to Firebase...
call firebase deploy
if %errorlevel% neq 0 (
    echo Deployment failed! Check Firebase login.
    pause
    exit /b %errorlevel%
)
echo.

echo ========================================
echo   ✓ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Your app is live at:
echo https://atomic-habits-tracker.web.app
echo.
pause
