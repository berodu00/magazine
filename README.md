# 고려아연 전자사보 시스템

**Korea Zinc Electronic Magazine System**

[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-brightgreen)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-06B6D4)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

---

## 📖 프로젝트 소개

고려아연 전자사보 시스템은 기업 사보를 디지털화하고, 임직원 참여형 커뮤니티 플랫폼으로 구축한 모던 웹 애플리케이션입니다.

### 주요 특징
- 🎨 **반응형 디자인**: 모바일, 태블릿, PC 모든 환경 지원
- 📝 **리치 콘텐츠**: HTML 기반 사보 작성 및 이미지 업로드
- 💬 **참여형 기능**: 반응, 별점, 이벤트, 아이디어 제안
- 📱 **소셜 통합**: YouTube, Instagram 콘텐츠 자동 수집
- 📊 **관리자 대시보드**: 실시간 통계 및 콘텐츠 관리
- 🔒 **보안**: JWT 기반 인증 및 역할 기반 접근 제어

---

## 🎯 주요 기능 명세

### 1. 사용자 기능
#### 1.1 사보 열람
- 카테고리별 게시물 필터링 (Special, People, Life)
- 해시태그 기반 게시물 검색
- 페이지네이션 및 정렬 (최신순, 조회수순)
- 반응형 카드 레이아웃

#### 1.2 참여 기능
- **반응**: 좋아요, 슬퍼요, 화나요, 웃겨요 (4가지 타입)
- **별점**: 5점 척도 평가
- **이벤트 참여**: 댓글 작성 및 당첨자 추첨
- **아이디어 제안**: 플로팅 버튼을 통한 제안 제출

#### 1.3 소셜 콘텐츠
- YouTube 공식 채널 영상 자동 수집
- Instagram 게시물 자동 수집
- 고려아연 홈페이지 뉴스 크롤링

### 2. 관리자 기능
#### 2.1 콘텐츠 관리
- **게시물**: HTML 에디터(TinyMCE)를 통한 사보 작성/수정/삭제
- **이벤트**: 이벤트 생성, 참여자 관리, 당첨자 추첨
- **팝업**: 메인 페이지 팝업 관리 (이미지형/텍스트형)
- **배너**: 롤링 배너 이미지 관리 및 순서 조정

#### 2.2 커뮤니케이션
- **뉴스레터**: 6개 게시물 선택 후 전 직원 이메일 발송
- **아이디어 관리**: 제안 검토 및 답변, 상태 변경

#### 2.3 통계 및 분석
- **대시보드**: 일일 방문자, 게시물 수, 이벤트 참여 현황
- **인기 게시물**: Top 10 게시물 조회수 및 반응 통계
- **카테고리/해시태그 통계**: 차트 시각화 (Recharts)

---

## 🛠️ 기술 스택

### Backend
| 기술 | 버전 | 용도 |
|-----|------|------|
| **Java** | 17 | 프로그래밍 언어 |
| **Spring Boot** | 3.2.1 | 프레임워크 |
| **Spring Data JPA** | 3.2.1 | ORM |
| **Spring Security** | 6.2.1 | 인증/인가 |
| **JWT (JJWT)** | 0.12.3 | 토큰 기반 인증 |
| **PostgreSQL** | 16 | RDBMS |
| **Jsoup** | 1.17.2 | 웹 크롤링 |
| **SpringDoc OpenAPI** | 2.3.0 | API 문서화 |

### Frontend
| 기술 | 버전 | 용도 |
|-----|------|------|
| **React** | 19.2 | UI 프레임워크 |
| **Vite** | 7.2.4 | 빌드 도구 |
| **React Router** | 7.12 | 라우팅 |
| **Axios** | 1.13.2 | HTTP 클라이언트 |
| **Tailwind CSS** | 4.1.18 | CSS 프레임워크 |
| **TinyMCE** | 8.3.1 | 리치 텍스트 에디터 |
| **Recharts** | 3.6.0 | 차트 라이브러리 |

### Infrastructure
- **Docker**: PostgreSQL 컨테이너 실행
- **Gradle**: 백엔드 빌드 도구
- **npm**: 프론트엔드 패키지 관리

---

## 🚀 설치 및 실행 방법

### 사전 요구사항
다음 소프트웨어가 설치되어 있어야 합니다:
- **Java 17** 이상
- **Node.js 18** 이상 및 npm
- **Docker** 및 Docker Compose
- **Git**

### 1. 저장소 클론
```bash
git clone https://github.com/your-org/magazine.git
cd magazine
```

### 2. 데이터베이스 설정
Docker Compose를 사용하여 PostgreSQL을 실행합니다.

```bash
docker-compose up -d
```

**확인:**
```bash
docker ps
# magazine-postgres-1 컨테이너가 실행 중인지 확인
```

PostgreSQL 접속 정보:
- **Host:** localhost
- **Port:** 5435
- **Database:** sabosystem
- **Username:** postgres
- **Password:** postgres

### 3. 백엔드 실행
#### 3-1. 의존성 설치 및 빌드
```bash
# Windows
.\gradlew build

# macOS/Linux
./gradlew build
```

#### 3-2. 애플리케이션 실행
```bash
# Windows
.\gradlew bootRun

# macOS/Linux
./gradlew bootRun
```

**확인:**
- 브라우저에서 `http://localhost:8080/swagger-ui.html` 접속
- API 문서가 표시되면 정상 실행

### 4. 프론트엔드 실행
새 터미널 창을 열어 프론트엔드 디렉토리로 이동합니다.

#### 4-1. 의존성 설치
```bash
cd frontend
npm install
```

#### 4-2. 개발 서버 실행
```bash
npm run dev
```

**확인:**
- 브라우저에서 `http://localhost:5173` 접속
- 메인 페이지가 표시되면 정상 실행

### 5. 초기 계정 정보
시스템이 시작되면 `data.sql`의 초기 데이터가 자동으로 로드됩니다.

#### 관리자 계정
- **이메일:** admin@koreazinc.com
- **비밀번호:** admin123

#### 테스트 사용자 계정
- **이메일:** user1@koreazinc.com, user2@koreazinc.com
- **비밀번호:** user123

---

## 🔧 환경 변수 설정 가이드

### Backend 환경 변수
`src/main/resources/application.yml` 파일에서 설정합니다.

#### 데이터베이스 설정
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5435/sabosystem?characterEncoding=UTF-8
    username: postgres
    password: postgres
```

#### JWT 시크릿 키
**보안 주의:** 운영 환경에서는 반드시 강력한 시크릿 키로 변경해야 합니다.
```yaml
security:
  jwt:
    secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    expiration: 3600000  # 1시간
    refresh-token-expiration: 604800000  # 7일
```

**시크릿 키 생성 방법:**
```bash
# 256비트 랜덤 키 생성 (Java)
openssl rand -hex 32
```

#### 파일 업로드 경로
```yaml
file:
  upload-dir: uploads
```

로컬 파일 시스템 경로: `프로젝트루트/uploads/`

#### SMTP 서버 설정 (뉴스레터)
**현재 Mock 모드로 실행됩니다.**
```yaml
spring:
  mail:
    host: smtp.koreazinc.com
    port: 587
    username: newsletter@koreazinc.com
    password: ${SMTP_PASSWORD:secret}  # 환경 변수로 설정 권장
```

실제 운영 시:
```bash
# Windows
set SMTP_PASSWORD=실제비밀번호
.\gradlew bootRun

# macOS/Linux
export SMTP_PASSWORD=실제비밀번호
./gradlew bootRun
```

#### 소셜 미디어 API 키
**현재 Mock 모드로 실행됩니다.**
```yaml
social:
  youtube:
    key: dummy-youtube-key
    channel-id: UC_dummy_channel_id
  instagram:
    token: dummy-instagram-token
```

실제 API 연동 시:
1. [Google Cloud Console](https://console.cloud.google.com/)에서 YouTube Data API v3 키 발급
2. [Instagram Graph API](https://developers.facebook.com/)에서 액세스 토큰 발급
3. `application.yml` 값 변경

#### Mock 모드 설정
```yaml
app:
  mock:
    enabled: true  # 개발 환경: true, 운영 환경: false
```

### Frontend 환경 변수
`frontend/vite.config.js` 파일에서 Proxy 설정을 확인합니다.

```javascript
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',  // Backend 주소
        changeOrigin: true
      }
    }
  }
})
```

**주의:** `localhost` 대신 `127.0.0.1`을 사용하여 IPv6 연결 문제를 방지합니다.

---

## 📁 프로젝트 구조

```
Magazine/
├── src/                          # Backend (Spring Boot)
│   ├── main/
│   │   ├── java/com/koreazinc/sabosystem/
│   │   │   ├── config/          # Spring 설정 (Security, JWT, CORS)
│   │   │   ├── controller/      # REST API 컨트롤러
│   │   │   ├── service/         # 비즈니스 로직
│   │   │   ├── repository/      # JPA Repository
│   │   │   ├── entity/          # JPA 엔티티
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   ├── security/        # JWT 유틸리티
│   │   │   └── exception/       # 예외 처리
│   │   └── resources/
│   │       ├── application.yml  # 설정 파일
│   │       ├── schema.sql       # DB 스키마
│   │       └── data.sql         # 초기 데이터
│   └── test/                    # 단위 테스트
│
├── frontend/                     # Frontend (React)
│   ├── public/                  # 정적 파일
│   ├── src/
│   │   ├── components/          # 재사용 컴포넌트
│   │   │   ├── common/         # Header, Footer 등
│   │   │   ├── admin/          # 관리자 전용
│   │   │   └── user/           # 사용자 전용
│   │   ├── pages/               # 페이지 컴포넌트
│   │   │   ├── auth/           # 로그인
│   │   │   ├── main/           # 메인 페이지
│   │   │   ├── magazine/       # 사보 (웹진)
│   │   │   ├── event/          # 이벤트
│   │   │   ├── social/         # 소셜 콘텐츠
│   │   │   └── admin/          # 관리자 페이지
│   │   ├── services/            # API 호출
│   │   ├── contexts/            # React Context
│   │   ├── utils/               # 유틸리티 함수
│   │   └── App.jsx              # 메인 앱
│   ├── package.json
│   └── vite.config.js
│
├── uploads/                      # 파일 업로드 디렉토리
├── doc/                          # 프로젝트 문서
│   ├── plan.md                  # 개발 계획
│   └── techspec.md              # 기술 명세서
├── docker-compose.yml           # PostgreSQL 컨테이너 설정
├── build.gradle                 # Gradle 빌드 설정
├── PROJECT_STATUS.md            # 프로젝트 상태 문서
└── README.md                    # 이 파일
```

---

## 🔌 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `POST /api/auth/logout` - 로그아웃

### 사보 게시판
- `GET /api/articles` - 게시물 목록 조회 (페이징, 필터링)
- `GET /api/articles/{id}` - 게시물 상세 조회
- `POST /api/articles` - 게시물 작성 (관리자)
- `PUT /api/articles/{id}` - 게시물 수정 (관리자)
- `DELETE /api/articles/{id}` - 게시물 삭제 (관리자)

### 반응 및 별점
- `POST /api/articles/{id}/reactions` - 반응 추가/변경
- `DELETE /api/articles/{id}/reactions` - 반응 취소
- `POST /api/articles/{id}/ratings` - 별점 추가/변경

### 이벤트
- `GET /api/events` - 이벤트 목록
- `GET /api/events/{id}` - 이벤트 상세
- `POST /api/events/{id}/participate` - 이벤트 참여
- `POST /api/events/{id}/draw-winners` - 당첨자 추첨 (관리자)
- `POST /api/events/{id}/announce-winners` - 당첨자 발표 (관리자)

### 소셜 콘텐츠
- `GET /api/social/youtube` - YouTube 콘텐츠 목록
- `GET /api/social/instagram` - Instagram 콘텐츠 목록
- `GET /api/social/homepage` - 고려아연 홈페이지 콘텐츠

### 관리자
- `GET /api/dashboard/stats` - 대시보드 통계
- `POST /api/newsletters` - 뉴스레터 발송
- `GET /api/categories` - 카테고리 목록
- `POST /api/categories` - 카테고리 추가

**자세한 API 명세는 `http://localhost:8080/swagger-ui.html`에서 확인할 수 있습니다.**

---

## 🧪 테스트

### 백엔드 테스트
```bash
# 전체 테스트 실행
.\gradlew test

# 특정 테스트만 실행
.\gradlew test --tests ArticleServiceTest
```

### 프론트엔드 테스트
```bash
cd frontend
npm run lint  # ESLint 실행
```

**주의:** 현재 E2E 테스트는 구현되지 않았습니다. 향후 Playwright 또는 Cypress 도입 예정.

---

## 📦 빌드 및 배포

### 프로덕션 빌드
#### Backend
```bash
.\gradlew build -x test
# 빌드 결과: build/libs/sabosystem-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build
# 빌드 결과: dist/ 디렉토리
```

### Docker 이미지 빌드 (선택사항)
```bash
# Backend Dockerfile 생성 후
docker build -t koreazinc/sabo-backend:1.0 .

# Frontend Dockerfile 생성 후
docker build -t koreazinc/sabo-frontend:1.0 .
```

### 배포 체크리스트
- [ ] `application.yml`에서 JWT 시크릿 키 변경
- [ ] `app.mock.enabled: false` 설정
- [ ] PostgreSQL 운영 서버 연결 정보 변경
- [ ] SMTP 서버 실제 정보 설정
- [ ] YouTube/Instagram API 키 설정
- [ ] 파일 업로드 디렉토리 권한 설정
- [ ] HTTPS 인증서 설정
- [ ] 백업 전략 수립

---

## 🛡️ 보안

### 구현된 보안 기능
- ✅ **JWT 토큰 인증**: 액세스 토큰 + 리프레시 토큰
- ✅ **비밀번호 암호화**: BCrypt 해싱
- ✅ **CORS 설정**: 허용된 Origin만 접근 가능
- ✅ **SQL Injection 방어**: JPA Parameterized Query
- ✅ **XSS 방어**: HTML Sanitization (예정)
- ✅ **파일 업로드 검증**: 확장자 및 MIME 타입 체크

### 보안 권장사항
1. **JWT 시크릿 키**: 운영 환경에서 강력한 256비트 키 사용
2. **HTTPS**: Let's Encrypt 등을 통한 SSL/TLS 인증서 설정
3. **CSRF 토큰**: Spring Security CSRF 보호 활성화
4. **Rate Limiting**: API 호출 제한 설정 (예: IP당 분당 100회)
5. **정기 보안 업데이트**: 의존성 라이브러리 최신 버전 유지

---

## 🐛 문제 해결

### 자주 발생하는 문제

#### 1. PostgreSQL 연결 실패
**증상:** `Connection refused: localhost:5432`
**해결:**
```bash
# Docker 컨테이너 상태 확인
docker ps

# 컨테이너 재시작
docker-compose down
docker-compose up -d

# 로그 확인
docker logs magazine-postgres-1
```

#### 2. Frontend API 호출 실패 (ECONNREFUSED)
**증상:** `ECONNREFUSED ::1:8080`
**해결:** `vite.config.js`에서 Proxy 타겟을 `http://127.0.0.1:8080`으로 변경

#### 3. 파일 업로드 실패
**증상:** `Failed to upload file`
**해결:**
- `uploads/` 디렉토리가 존재하는지 확인
- 디렉토리 쓰기 권한 확인 (`chmod 755 uploads`)
- 파일 크기 제한 확인 (최대 10MB)

#### 4. JWT 토큰 만료
**증상:** `401 Unauthorized`
**해결:** 로그아웃 후 다시 로그인하여 새 토큰 발급

---

## 📝 라이선스

이 프로젝트는 고려아연의 독점 소유입니다. 무단 복제, 배포, 수정을 금지합니다.

---

## 🤝 기여

**내부 개발 프로젝트**로 외부 기여는 받지 않습니다.

---

## 📧 연락처

**개발 문의:** 개발팀  
**운영 문의:** 커뮤니케이션팀  
**이슈 보고:** GitHub Issues

---

## 📚 추가 문서

- [프로젝트 상태 문서](PROJECT_STATUS.md) - 완료/미완료 기능, 알려진 이슈
- [개발 계획 문서](doc/plan.md) - Phase별 상세 작업 계획
- [기술 명세서](doc/techspec.md) - 아키텍처, 데이터베이스, API 명세
- [Swagger API 문서](http://localhost:8080/swagger-ui.html) - 실시간 API 테스트

---

**버전:** 1.0  
**최종 업데이트:** 2026-01-11  
**개발 기간:** 2026-01-08 ~ 현재
