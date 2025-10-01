# Database Setup Script
Write-Host "Setting up PostgreSQL database..." -ForegroundColor Green

# Check if PostgreSQL is running
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Please install PostgreSQL first." -ForegroundColor Red
    exit 1
}

# Create database
Write-Host "Creating database 'kids_game_db'..." -ForegroundColor Yellow
try {
    psql -U postgres -c "CREATE DATABASE kids_game_db;" 2>$null
    Write-Host "✅ Database 'kids_game_db' created successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Database might already exist or there was an error." -ForegroundColor Yellow
    Write-Host "Please create the database manually using pgAdmin or psql:" -ForegroundColor Cyan
    Write-Host "CREATE DATABASE kids_game_db;" -ForegroundColor White
}

Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Update the .env file in api/api/ with your PostgreSQL credentials" -ForegroundColor White
Write-Host "2. Start the API server: cd api/api && npm run start:dev" -ForegroundColor White
Write-Host "3. Start the dashboard: cd dashboard && npm run dev" -ForegroundColor White
