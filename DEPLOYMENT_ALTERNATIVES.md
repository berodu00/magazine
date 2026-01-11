# Railway 배포 대안 가이드

## 🔄 현재 상황
`railway up` CLI 배포가 서비스 선택 단계에서 대기 중입니다.

---

## ✅ 권장 방법: GitHub 저장소 연동

Railway는 GitHub 저장소를 직접 연결하여 배포하는 것이 가장 간단합니다!

### 단계:
1. **Railway 대시보드** 접속
   - https://railway.com/project/b2e286b9-1447-43d0-8aea-dda5894b634b

2. **"+ New" 클릭** → "GitHub Repo" 선택

3. **저장소 선택**
   - `berodu00/magazine` 선택

4. **Backend 서비스 설정**
   - **Root Directory**: `/` (또는 비워두기)
   - **Build Command**: `./gradlew build -x test`
   - **Start Command**: `java -Dserver.port=$PORT -jar build/libs/sabosystem-0.0.1-SNAPSHOT.jar`
   - **Watch Paths**: (비워두기 또는 `src/**`)

5. **환경 변수 확인**
   - Variables 탭에서 기존에 추가한 변수 확인:
     - `JWT_SECRET`: ✅
     - `MOCK_ENABLED`: ✅
     - `DATABASE_URL`: ✅ (자동)

6. **배포 시작**
   - 설정 저장 시 자동으로 빌드 및 배포 시작

### 장점:
- ✅ 자동 재배포 (GitHub push 시)
- ✅ 빌드 로그 실시간 확인
- ✅ 환경 변수 자동 연동
- ✅ CLI 명령어 불필요

---

## 🚀 대안: ngrok (즉시 공유)

가장 빠른 방법! 5분이면 완료됩니다.

### 설치:
```bash
# Winget으로 설치
winget install ngrok

# 또는 직접 다운로드
# https://ngrok.com/download
```

### 사용:
```bash
# Backend 터널 (현재 터미널)
ngrok http 8080

# Frontend 터널 (새 터미널)
cd frontend
ngrok http 5173
```

### 결과:
```
Backend URL: https://abcd-1234-example.ngrok-free.app
Frontend URL: https://efgh-5678-example.ngrok-free.app
```

Frontend의 `VITE_API_URL`을 Backend ngrok URL로 설정하고 재시작하면 완료!

### 장점:
- ✅ 즉시 사용 가능 (5분)
- ✅ 설정 최소화
- ✅ 테스트/데모용으로 완벽

### 단점:
- ⚠️ 무료는 8시간 세션
- ⚠️ URL이 매번 바뀜
- ⚠️ 임시 공유용

---

## 📊 비교표

| 방법 | 소요 시간 | 영구성 | 자동 재배포 | 추천도 |
|-----|---------|-------|-----------|-------|
| **Railway GitHub** | 10분 | ✅ 영구 | ✅ 자동 | ⭐⭐⭐⭐⭐ |
| **ngrok** | 5분 | ⚠️ 8시간 | ❌ 수동 | ⭐⭐⭐⭐ |
| **railway up (CLI)** | 15분+ | ✅ 영구 | ❌ 수동 | ⭐⭐⭐ |

---

## 💡 권장사항

**프로덕션/장기 공유**: Railway GitHub 연동  
**즉시 테스트/데모**: ngrok

---

**작성 시간**: 2026-01-11 20:24
