# Create .env file for Supabase + Prisma
# This script helps you set up your environment variables

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Supabase .env Configuration Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "This script will create a .env file for your NestJS API`n" -ForegroundColor White

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (yes/no)"
    if ($overwrite -ne "yes") {
        Write-Host "Cancelled. Using existing .env file." -ForegroundColor Green
        exit
    }
}

Write-Host "`nPlease enter your Supabase credentials:`n" -ForegroundColor Cyan

# Get Supabase credentials
$projectId = Read-Host "Supabase Project ID (e.g., postgres.yorotjehnjscerexjtrb)"
$password = Read-Host "Supabase Database Password" -AsSecureString
$passwordPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($password))

# Get other credentials (optional)
$jwtSecret = Read-Host "JWT Secret (press Enter for default)"
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = "your_jwt_secret_key_here"
}

$openaiKey = Read-Host "OpenAI API Key (optional, press Enter to skip)"
if ([string]::IsNullOrWhiteSpace($openaiKey)) {
    $openaiKey = "your_openai_api_key_here"
}

# Build connection strings
$databaseUrl = "postgresql://postgres.${projectId}:${passwordPlain}@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
$directUrl = "postgresql://postgres.${projectId}:${passwordPlain}@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# Create .env content
$envContent = @"
# Supabase Database Configuration
DATABASE_URL="$databaseUrl"
DIRECT_URL="$directUrl"

# JWT Configuration
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=24h

# OpenAI Configuration
OPENAI_API_KEY=$openaiKey
OPENAI_BASE_URL=https://api.openai.com/v1

# Server Configuration
PORT=3001
NODE_ENV=development
"@

# Write .env file
$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "`n✅ .env file created successfully!" -ForegroundColor Green
Write-Host "`n📝 Next steps:`n" -ForegroundColor Cyan
Write-Host "1. Test the connection:" -ForegroundColor White
Write-Host "   npm run prisma:generate`n" -ForegroundColor Gray

Write-Host "2. Create initial migration:" -ForegroundColor White
Write-Host "   npm run prisma:migrate`n" -ForegroundColor Gray

Write-Host "3. Test with Prisma Studio:" -ForegroundColor White
Write-Host "   npm run prisma:studio`n" -ForegroundColor Gray

Write-Host "⚠️  IMPORTANT: Do NOT commit .env to git!" -ForegroundColor Yellow
Write-Host "   It's already in .gitignore for security.`n" -ForegroundColor Yellow

Write-Host "========================================`n" -ForegroundColor Cyan
