# Regenerate Supabase Types
# Run this after deploying the e-commerce database

Write-Host "Regenerating Supabase TypeScript types..." -ForegroundColor Cyan

# Check if Supabase CLI is installed
$supabaseInstalled = Get-Command supabase -ErrorAction SilentlyContinue

if (-not $supabaseInstalled) {
    Write-Host "Supabase CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g supabase
}

# Generate types
Write-Host "Generating types from Supabase..." -ForegroundColor Green
supabase gen types typescript --linked > src/integrations/supabase/types.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Types regenerated successfully!" -ForegroundColor Green
    Write-Host "Restart your dev server with: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Failed to generate types." -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Supabase Dashboard → Settings → API" -ForegroundColor White
    Write-Host "2. Scroll to 'Generate TypeScript types'" -ForegroundColor White
    Write-Host "3. Copy the generated code" -ForegroundColor White
    Write-Host "4. Replace src/integrations/supabase/types.ts" -ForegroundColor White
}
