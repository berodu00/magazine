@echo off
chcp 65001 > nul
setlocal

set API_URL=http://localhost:8080/api

echo 1. Login
curl -s -X POST %API_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@koreazinc.com\", \"password\":\"admin123\"}" > login_response.json

for /f "tokens=*" %%a in ('powershell -Command "Get-Content login_response.json | ConvertFrom-Json | Select-Object -ExpandProperty accessToken"') do set TOKEN=%%a

echo.
echo 2. Check Categories (Is 'ESG' there?)
curl -s -X GET %API_URL%/categories ^
  -H "Authorization: Bearer %TOKEN%"

echo.
echo 3. Check Image
curl -I http://localhost:8080/uploads/seed/esg.png

echo.
echo 4. Check Articles again
curl -s -X GET %API_URL%/articles?size=20 ^
  -H "Authorization: Bearer %TOKEN%"
