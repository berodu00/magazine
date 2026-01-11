# ngrok 인증 및 대안 가이드

## 🔑 현재 상황
ngrok이 설치되었지만 인증 토큰이 필요합니다.

---

## ✅ Option 1: ngrok 계정 생성 (추천)

### 1. 계정 생성
https://dashboard.ngrok.com/signup

- GitHub 계정으로 즉시 가입 가능
- 완전 무료

### 2. Authtoken 복사
로그인 후 대시보드에서 authtoken 복사

### 3. ngrok 설정
```bash
ngrok config add-authtoken YOUR_TOKEN
```

### 4. 터널 시작
```bash
# Backend 터널
ngrok http 8080

# Frontend 터널 (새 터미널)
ngrok http 5173
```

**결과 URL 예시:**
- Backend: `https://abc-123.ngrok-free.app`
- Frontend: `https://def-456.ngrok-free.app`

---

## 🚀 Option 2: localtunnel (인증 불필요)

### 설치
```bash
npm install -g localtunnel
```

### 사용
```bash
# Backend 터널
lt --port 8080

# Frontend 터널 (새 터미널)
lt --port 5173
```

**결과 URL 예시:**
- Backend: `https://funny-dog-123.loca.lt`
- Frontend: `https://happy-cat-456.loca.lt`

### 장단점
✅ 인증 불필요
✅ 즉시 사용 가능
⚠️ URL이 더 길고 복잡함
⚠️ 첫 접속 시 확인 페이지 표시됨

---

## 📊 비교

| 항목 | ngrok | localtunnel |
|-----|-------|-------------|
| **설정 시간** | 2분 (계정 생성) | 30초 |
| **URL 길이** | 짧음 | 긺 |
| **첫 접속** | 즉시 | 확인 페이지 |
| **안정성** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

**권장:** ngrok (더 프로페셔널)
**빠름:** localtunnel (즉시 사용)

---

**작성 시간:** 2026-01-11 21:09
