@echo off
echo ========================================================
echo   CYBERTRACE-X: PUSHING COMPLETE PROJECT TO GITHUB
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/4] Initializing Git repository...
git init

echo.
echo [2/4] Staging all files and folders (excluding node_modules)...
git add .

echo.
echo [3/4] Committing changes...
git commit -m "Upload complete CyberTrace-X framework with all folders and features"

echo.
echo [4/4] Setting remote origin to your GitHub repository...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/anushka-29007/Cybertrace-x.git

echo.
echo ========================================================
echo   Pushing to GitHub (main branch)...
echo   (If prompted by Windows, sign in to your GitHub account)
echo ========================================================
git push -u origin main --force

echo.
echo ========================================================
echo   Done! Check your repository at:
echo   https://github.com/anushka-29007/Cybertrace-x
echo ========================================================
pause
