# 🌐 Localtunnel 배포 성공!

## ✅ 생성된 공개 URL

### Backend
**URL:** https://spicy-bikes-brush.loca.lt  
**로컬 포트:** 8080  
**상태:** 🟢 실행 중

### Frontend  
**URL:** https://wet-rabbits-happen.loca.lt  
**로컬 포트:** 5173  
**상태:** 🟢 실행 중

---

## 🔧 Frontend 설정 업데이트 필요

Frontend가 공개 Backend URL을 사용하도록 설정해야 합니다.

### `frontend/src/services/api.js` 수정:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://spicy-bikes-brush.loca.lt/api',  // 공개 Backend URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ... 나머지 코드
```

또는 환경 변수 사용:
```javascript
baseURL: import.meta.env.VITE_API_URL || '/api'
```

그리고 `.env.production` 파일 생성:
```env
VITE_API_URL=https://spicy-bikes-brush.loca.lt/api
```

---

## 🚀 사용 방법

### 1. 첫 접속 시
localtunnel은 보안을 위해 첫 접속 시 확인 화면을 표시합니다:
- URL 클릭 → "Continue" 버튼 클릭

### 2. 공유하기
생성된 URL을 다른 사람과 공유:
- **Frontend:** https://wet-rabbits-happen.loca.lt
- 인터넷이 연결된 어디서나 접속 가능!

### 3. 세션 유지
- 터널은 터미널이 열려있는 동안 유지됩니다
- 종료: `Ctrl+C`
- 재시작: `lt --port 8080` (새 URL 생성됨)

---

## ⚠️ 주의사항

1. **PC 실행 필요**: 이 PC가 꺼지면 접속 불가
2. **로컬 DB 사용**: PostgreSQL Docker가 실행 중이어야 함
3. **임시 URL**: 터널 재시작 시 URL 변경됨

---

## 🔄 터널 재시작 (필요 시)

```bash
# Backend 터널 종료 후 재시작
Ctrl+C
lt --port 8080

# Frontend 터널 종료 후 재시작  
Ctrl+C
lt --port 5173
```

---

**생성 시간:** 2026-01-11 21:25  
**유효 기간:** PC가 켜진 동안 무제한  
**상태:** ✅ 배포 완료!
