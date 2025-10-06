# PowerShell script to start both API and Dashboard in development mode

Write-Host "🚀 Starting Kids Game Development Environment..." -ForegroundColor Green

# Function to start API server
function Start-API {
    Write-Host "📡 Starting API server on port 3001..." -ForegroundColor Yellow
    Set-Location "api/api"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run start:dev"
    Set-Location "../.."
}

# Function to start Dashboard
function Start-Dashboard {
    Write-Host "🎨 Starting Dashboard on port 8080..." -ForegroundColor Yellow
    Set-Location "dashboard"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"
    Set-Location ".."
}

# Start both services
Start-API
Start-Sleep -Seconds 3
Start-Dashboard

Write-Host "✅ Both services are starting up!" -ForegroundColor Green
Write-Host "📡 API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🎨 Dashboard: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🧪 CORS Test: Open api/api/test-cors.html in your browser" -ForegroundColor Cyan
