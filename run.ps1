# CyberTrace-X Launcher for PowerShell
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CYBERTRACE-X: AI Cybercrime Investigation Framework" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1/2] Starting CyberTrace-X Core Server on port 5000..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "$PSScriptRoot\server" -WindowStyle Hidden
Start-Sleep -Seconds 2
Write-Host ""
Write-Host "[2/2] Opening CyberTrace-X in your default browser..." -ForegroundColor Green
Start-Process "http://localhost:5000"
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CYBERTRACE-X IS READY AND RUNNING!" -ForegroundColor Green
Write-Host "  URL: http://localhost:5000" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
