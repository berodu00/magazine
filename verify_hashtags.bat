@echo off

echo Logging in...
curl -s -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d @login.json > token.json
for /f "tokens=*" %%a in ('type token.json ^| findstr "accessToken"') do set TOKEN_LINE=%%a
set TOKEN=%TOKEN_LINE:~18,-2%
echo Token acquired.

echo Creating Article with Hashtags...
curl -s -X POST http://localhost:8080/api/articles -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d @article_hashtag.json
echo.

echo Getting Popular Hashtags...
curl -s -X GET http://localhost:8080/api/hashtags -H "Authorization: Bearer %TOKEN%"
echo.

echo Filtering Articles by Hashtag 'TestTag1'...
curl -s -X GET "http://localhost:8080/api/articles?hashtag=TestTag1" -H "Authorization: Bearer %TOKEN%"
echo.
