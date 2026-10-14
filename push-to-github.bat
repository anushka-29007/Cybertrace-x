@echo off
echo ========================================================
echo   CYBERTRACE-X: PUSHING COMPLETE PROJECT TO GITHUB
echo ========================================================
echo.
cd /d "%~dp0"

echo [1/5] Setting Git author to your profile (anushka-29007)...
git config user.name "anushka-29007"
git config user.email "anushka2906as@gmail.com"

echo.
echo [2/5] Ensuring other projects (PhishGuard) are excluded...
git rm -r --cached PhishGuard PhishGuard-Team 2>nul

echo.
echo [3/5] Staging CyberTrace-X files only...
git add .gitignore README.md package.json Dockerfile docker-compose.yml ecosystem.config.js run.bat run.ps1 push-to-github.bat client server

echo.
echo [4/5] Committing changes under anushka-29007...
git commit -m "Upload complete CyberTrace-X framework with all features" --author="anushka-29007 <anushka2906as@gmail.com>"

echo.
echo [5/5] Pushing to GitHub (main branch)...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/anushka-29007/Cybertrace-x.git
git push -u origin main --force

echo.
echo ========================================================
echo   Done! Check your repository at:
echo   https://github.com/anushka-29007/Cybertrace-x
echo ========================================================
pause
