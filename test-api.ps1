# Test API Authentication
Write-Host "Testing API Authentication..." -ForegroundColor Green

# Wait for API to start
Write-Host "Waiting for API to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test login endpoint
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method POST -ContentType "application/json" -Body '{"email":"admin@kidsgame.com","password":"admin123"}'
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Access Token: $($response.access_token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "User: $($response.user.email)" -ForegroundColor Cyan
    
    # Test protected endpoint
    $headers = @{
        "Authorization" = "Bearer $($response.access_token)"
    }
    
    $profile = Invoke-RestMethod -Uri "http://localhost:3001/auth/profile" -Method GET -Headers $headers
    Write-Host "✅ Profile endpoint working!" -ForegroundColor Green
    Write-Host "Profile: $($profile.email) - $($profile.role)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ API test failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host "Make sure PostgreSQL is running and the database 'kids_game_db' exists" -ForegroundColor Yellow
}
