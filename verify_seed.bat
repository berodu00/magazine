@echo off
setlocal

set API_URL=http://localhost:8080/api

echo 1. Login as Admin
curl -X POST %API_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@koreazinc.com\", \"password\":\"admin123\"}" > login_response.json

for /f "tokens=*" %%a in ('powershell -Command "Get-Content login_response.json | ConvertFrom-Json | Select-Object -ExpandProperty accessToken"') do set TOKEN=%%a

echo.
echo Token: %TOKEN:~0,20%...

echo.
echo 2. Get Articles (Check if seeded articles exist)
curl -X GET %API_URL%/articles ^
  -H "Authorization: Bearer %TOKEN%"

echo.
echo 3. Get Popular Hashtags
curl -X GET %API_URL%/hashtags ^
  -H "Authorization: Bearer %TOKEN%"
