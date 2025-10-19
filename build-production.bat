@echo off
echo Building production-ready Atomic Habits Tracker...

echo.
echo 1. Installing dependencies...
call npm install

echo.
echo 2. Running tests...
call npm test -- --coverage --watchAll=false

echo.
echo 3. Building production bundle...
call npm run build

echo.
echo 4. Production build complete!
echo Files are ready in the 'build' folder.
echo.
echo To deploy:
echo - Upload 'build' folder contents to your web server
echo - Or use: npm run analyze to test locally
echo.
pause