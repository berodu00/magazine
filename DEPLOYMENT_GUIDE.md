# Railway 배포 가이드

## 📋 사전 준비

### 1. Railway 계정 생성
1. https://railway.app 접속
2. "Start a New Project" 클릭
3. GitHub 계정으로 로그인
4. 저장소 연동 권한 부여

---

## 🚀 배포 단계

### Step 1: Railway CLI 로그인
```bash
railway login
```
- 브라우저가 자동으로 열림
- GitHub 계정으로 인증
- 터미널에 "Logged in as [사용자명]" 표시 확인

### Step 2: 새 프로젝트 생성
```bash
railway init
```
- 프로젝트 이름 입력: `korea-zinc-magazine`
- Railway 대시보드에 프로젝트 생성됨

### Step 3: PostgreSQL 데이터베이스 추가
Railway 웹 대시보드에서:
1. 프로젝트 선택
2. "+ New" 클릭
3. "Database" → "PostgreSQL" 선택
4. 자동으로 DATABASE_URL 환경 변수 생성됨

또는 CLI로:
```bash
railway add --database postgres
```

### Step 4: Backend 배포 준비

#### 4-1. application.yml 수정
`src/main/resources/application.yml`에서 환경 변수 사용하도록 변경:

```yaml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5435/sabosystem?characterEncoding=UTF-8}
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}

security:
  jwt:
    secret: ${JWT_SECRET:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}

app:
  mock:
    enabled: ${MOCK_ENABLED:false}

server:
  port: ${PORT:8080}
```

#### 4-2. Procfile 생성 (프로젝트 루트)
```
web: java -Dserver.port=$PORT -jar build/libs/sabosystem-0.0.1-SNAPSHOT.jar
```

#### 4-3. Backend 빌드
```bash
.\gradlew build -x test
```

#### 4-4. 환경 변수 설정 (Railway 대시보드에서)
Backend 서비스 설정:
- `JWT_SECRET`: (openssl rand -hex 32로 생성한 키)
- `MOCK_ENABLED`: false
- `SPRING_PROFILES_ACTIVE`: prod

### Step 5: Backend 배포
```bash
railway up
```

배포 후 서비스 URL 확인:
```bash
railway status
```

예상 URL: `https://korea-zinc-magazine-backend.up.railway.app`

### Step 6: Frontend 배포 준비

#### 6-1. 환경 변수 설정
`frontend/.env.production` 생성:
```env
VITE_API_URL=https://your-backend.up.railway.app
```

#### 6-2. vite.config.js 수정
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist'
  }
})
```

#### 6-3. package.json에 시작 스크립트 추가
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "vite preview --port $PORT"
  }
}
```

#### 6-4. Frontend 빌드
```bash
cd frontend
npm run build
```

### Step 7: Frontend 배포
Railway 대시보드에서:
1. "+ New" → "GitHub Repo" 선택
2. `berodu00/magazine` 선택
3. Root Directory: `/frontend` 설정
4. Build Command: `npm run build`
5. Start Command: `npm run start`

또는 별도 서비스로 배포:
```bash
cd frontend
railway link  # 기존 프로젝트 선택
railway up
```

---

## 🔧 최종 설정

### CORS 설정 (Backend)
`WebConfig.java`:
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins(
            "https://your-frontend.up.railway.app",
            "http://localhost:5173"
        )
        .allowedMethods("*")
        .allowCredentials(true);
}
```

### 데이터베이스 마이그레이션
Railway PostgreSQL에 초기 데이터 삽입:
```bash
# Railway 데이터베이스에 연결
railway run psql -h [호스트] -U postgres -d railway

# 또는 schema.sql, data.sql 실행
railway run psql < src/main/resources/schema.sql
railway run psql < src/main/resources/data.sql
```

---

## ✅ 배포 확인

### 1. Backend 확인
```bash
curl https://your-backend.up.railway.app/api/articles
```

### 2. Frontend 확인
브라우저에서 `https://your-frontend.up.railway.app` 접속

### 3. 로그 확인
```bash
railway logs
```

---

## 🎯 예상 결과

**Backend URL**: `https://korea-zinc-magazine-backend.up.railway.app`  
**Frontend URL**: `https://korea-zinc-magazine-frontend.up.railway.app`

**비용**: 
- 무료 플랜: 500시간/월
- $5/월 플랜: 무제한 사용 + 추가 리소스

---

## 🐛 문제 해결

### 빌드 실패 시
```bash
railway logs --build
```

### 서비스 재시작
```bash
railway restart
```

### 환경 변수 확인
```bash
railway variables
```

---

**작성일**: 2026-01-11  
**Railway 버전**: Latest (CLI)
