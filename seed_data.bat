@echo off
chcp 65001 > nul
setlocal

set API_URL=http://localhost:8080/api

REM 1. Login
curl -s -X POST %API_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@koreazinc.com\", \"password\":\"admin123\"}" > login_token.json

for /f "tokens=*" %%a in ('powershell -Command "Get-Content login_token.json | ConvertFrom-Json | Select-Object -ExpandProperty accessToken"') do set TOKEN=%%a

REM 2. Create Article 1 (ESG)
echo Creating Article 1...
curl -s -X POST %API_URL%/articles ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json; charset=utf-8" ^
  -d @article1.json

REM 3. Create Article 2 (Innovation)
echo Creating Article 2...
curl -s -X POST %API_URL%/articles ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json; charset=utf-8" ^
  -d @article2.json

REM 4. Create Article 3 (People)
echo Creating Article 3...
curl -s -X POST %API_URL%/articles ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json; charset=utf-8" ^
  -d @article3.json

echo Done.
