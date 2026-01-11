# Railway 배포 진행 상황

## ✅ 완료된 단계

### Step 1-3: 초기 설정 ✅
- Railway CLI 설치 완료
- Railway 로그인 완료 (berodu00@gmail.com)
- 프로젝트 생성 완료: `korea-zinc-magazine`
- 프로젝트 URL: https://railway.com/project/b2e286b9-1447-43d0-8aea-dda5894b634b

### Step 4: Backend 배포 준비 ✅
- ✅ application.yml 환경 변수 설정 완료
  - DATABASE_URL (PostgreSQL 연결)
  - DB_USERNAME, DB_PASSWORD
  - JWT_SECRET
  - MOCK_ENABLED
  - PORT
- ✅ Procfile 생성 완료
- ✅ Backend 빌드 완료
  - 빌드 파일: `build/libs/sabosystem-0.0.1-SNAPSHOT.jar`
  - 빌드 결과: Success (Exit code 0)

---

## 📋 다음 단계 (Step 5)

### Step 5: PostgreSQL 데이터베이스 추가

Railway 웹 대시보드에서 수동으로 진행해야 합니다:

#### 방법 1: Railway 대시보드 (추천)
1. https://railway.com/project/b2e286b9-1447-43d0-8aea-dda5894b634b 접속
2. "+ New" 버튼 클릭
3. "Database" 선택
4. "PostgreSQL" 선택
5. 자동으로 `DATABASE_URL` 환경 변수가 생성됩니다

#### 방법 2: CLI (더 빠름)
```bash
railway add
```
메뉴에서 "PostgreSQL" 선택

---

### Step 6: Backend 환경 변수 설정

Railway 대시보드에서 Backend 서비스 설정:

#### 필수 환경 변수:
```bash
# JWT 시크릿 키 생성
openssl rand -hex 32
# 결과 복사하여 JWT_SECRET에 설정
```

**설정할 환경 변수:**
- `JWT_SECRET`: (위에서 생성한 키)
- `MOCK_ENABLED`: `false`
- `SPRING_PROFILES_ACTIVE`: `prod` (선택사항)

Railway 대시보드:
1. 프로젝트 선택
2. Backend 서비스 클릭
3. "Variables" 탭
4. "+ New Variable" 클릭하여 추가

---

### Step 7: Backend 배포

```bash
railway up
```

배포 후 서비스 URL 확인:
```bash
railway status
```

예상 Backend URL: `https://korea-zinc-magazine-production.up.railway.app`

---

### Step 8: 데이터베이스 초기화

Railway PostgreSQL에 스키마와 데이터 삽입:

```bash
# Railway DB에 연결
railway connect postgres

# 또는 psql 명령어로 직접
railway run psql $DATABASE_URL < src/main/resources/schema.sql
railway run psql $DATABASE_URL < src/main/resources/data.sql
```

---

## ⚠️ 주의사항

1. **PostgreSQL 추가**: Railway 대시보드에서 수동으로 추가 필요
2. **환경 변수**: Backend 배포 전에 반드시 설정
3. **DATABASE_URL**: PostgreSQL 추가 시 자동으로 생성되므로 별도 설정 불필요
4. **JWT_SECRET**: 보안을 위해 강력한 키로 변경 필수

---

**현재 상태**: Step 4 완료, Step 5 대기 중  
**다음 작업**: Railway 대시보드에서 PostgreSQL 추가

**업데이트 시간**: 2026-01-11 20:07
