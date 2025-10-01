# Check and create database if needed
Write-Host "Checking PostgreSQL database..." -ForegroundColor Green

$psqlPath = "C:\Program Files\PostgreSQL\17\bin\psql.exe"

if (Test-Path $psqlPath) {
    Write-Host "✅ PostgreSQL found at: $psqlPath" -ForegroundColor Green
    
    # Check if database exists
    Write-Host "Checking if 'kids_game_db' exists..." -ForegroundColor Yellow
    try {
        $result = & $psqlPath -U postgres -c "SELECT datname FROM pg_database WHERE datname = 'kids_game_db';" 2>$null
        if ($result -match "kids_game_db") {
            Write-Host "✅ Database 'kids_game_db' already exists!" -ForegroundColor Green
        } else {
            Write-Host "❌ Database 'kids_game_db' does not exist. Creating it..." -ForegroundColor Yellow
            & $psqlPath -U postgres -c "CREATE DATABASE kids_game_db;"
            Write-Host "✅ Database 'kids_game_db' created successfully!" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Error connecting to PostgreSQL. Please check:" -ForegroundColor Red
        Write-Host "1. PostgreSQL service is running" -ForegroundColor Yellow
        Write-Host "2. Password for 'postgres' user" -ForegroundColor Yellow
        Write-Host "3. Try running: pg_ctl start" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ PostgreSQL not found at expected location" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or update the path in this script" -ForegroundColor Yellow
}
