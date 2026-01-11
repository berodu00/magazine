# 🎉 ngrok 배포 완료!

## ✅ 공개 URL

### Backend
**URL:** https://kz-magazine-backend.jp.ngrok.io  
**로컬 포트:** 8080  
**상태:** 🟢 Online

**API 테스트:**
- 게시물 목록: https://kz-magazine-backend.jp.ngrok.io/api/articles
- Swagger API 문서: https://kz-magazine-backend.jp.ngrok.io/swagger-ui.html

### Frontend
**URL:** https://kz-magazine-frontend.jp.ngrok.io  
**로컬 포트:** 5173  
**상태:** 🟢 Online

---

## 🔧 중요 참고사항

### Frontend API 연결
현재 Frontend는 로컬 Backend(`/api`)를 가리키고 있습니다.  
외부에서 Frontend에 접속할 때 Backend API가 작동하려면 **Frontend 설정 업데이트가 필요**합니다.

**수정 필요:** `frontend/src/services/api.js` 또는 환경 변수

두 가지 옵션:
1. Frontend에서 Backend ngrok URL 사용
2. Frontend를 로컬에서만 사용하고 Backend만 공유

---

## 📱 사용 방법

### 1. 외부에서 접속
- **Frontend:** https://kz-magazine-frontend.jp.ngrok.io
- **Backend API:** https://kz-magazine-backend.jp.ngrok.io

### 2. ngrok 세션 유지
- 터미널을 닫으면 터널이 중단됩니다
- 중단하려면: `Ctrl+C`
- 재시작: `ngrok start backend frontend`

### 3. ngrok Web Interface
- **URL:** http://127.0.0.1:4040
- 실시간 요청 모니터링 가능

---

## ⚠️ 주의사항

1. **ngrok 경고 페이지**
   - 처음 접속 시 ngrok 경고 페이지가 표시될 수 있습니다
   - "Visit Site" 버튼 클릭하여 계속 진행

2. **PC 실행 필요**
   - PC가 꺼지면 터널 중단
   - 로컬 서버(Spring Boot, React)가 실행 중이어야 함

3. **계정 플랜**
   - 현재 플랜: Hobbyist (유료)
   - 무제한 터널 사용 가능
   - 고유 서브도메인 사용 가능

---

## 🎯 공유하기

이제 다음 URL을 공유하면 인터넷 어디서나 접속 가능합니다:

**사용자용:**  
🌐 https://kz-magazine-frontend.jp.ngrok.io

**개발자용 (API):**  
🔧 https://kz-magazine-backend.jp.ngrok.io/api/articles

---

**배포 완료 시간:** 2026-01-11 21:46  
**ngrok 계정:** berodu (Hobbyist)  
**ngrok 버전:** 3.34.1  
**상태:** ✅ 정상 운영 중
