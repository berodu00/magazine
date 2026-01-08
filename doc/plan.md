# 전자사보 시스템 개발 계획 (Plan)

**프로젝트명:** 고려아연 전자사보 고도화 프로젝트  
**작성일:** 2026-01-08  
**버전:** 1.0  

---

## 📋 문서 개요

이 문서는 **개발자 에이전트**와 **검수자 에이전트**가 작업 진행 상황을 관리하는 체크리스트입니다.

### 작업 흐름
1. **개발자 에이전트**: 각 작업 항목을 구현
2. **검수자 에이전트**: 구현된 기능을 테스트
3. **테스트 통과 시**: 체크박스를 `[ ]` → `[x]`로 변경하고 `plan.md` 업데이트
4. **테스트 실패 시**: 이슈를 문서 하단 `## 🐛 발견된 이슈` 섹션에 기록

---

## 📊 전체 진행 현황

| Phase | 진행률 | 상태 | 예상 기간 | 실제 기간 |
|-------|--------|------|----------|----------|
| Phase 1: MVP | 20/51 (39%) | 🔧 진행 중 | 2-3주 | - |
| Phase 2: 참여형 기능 | 0/35 (0%) | ⏳ 대기 중 | 2-3주 | - |
| Phase 3: 소셜 연동 | 0/28 (0%) | ⏳ 대기 중 | 3-4주 | - |

**전체 진행률: 20/114 (17%)**

---

## 🎯 Phase 1: MVP (핵심 기능)

**목표:** 기본 사보 시스템 구축 및 관리자 기능  
**시작일:** -  
**완료일:** -  
**상태:** 🔧 진행 중

---

### 1.1 프로젝트 초기 설정

#### Backend 설정
- [x] **1.1.1** Spring Boot 프로젝트 생성 (`build.gradle` 설정)
  - 파일: `build.gradle`
  - 확인 사항: 모든 의존성 정상 추가 (Spring Web, JPA, Security, JWT, PostgreSQL 등)
  
- [x] **1.1.2** `application.yml` 설정 파일 작성
  - 파일: `src/main/resources/application.yml`
  - 확인 사항: DB 연결 정보, JWT 시크릿, 파일 업로드 경로 등 포함
  
- [x] **1.1.3** Docker Compose로 PostgreSQL 실행
  - 파일: `docker-compose.yml`
  - 확인 사항: `docker-compose up -d` 실행 후 PostgreSQL 접속 확인
  
- [x] **1.1.4** 데이터베이스 스키마 생성
  - 파일: `src/main/resources/schema.sql` 또는 JPA Entity 기반 자동 생성
  - 확인 사항: 15개 테이블 정상 생성 확인 (`\dt` 명령어로 확인)
  
- [x] **1.1.5** 초기 데이터 삽입 (관리자 계정, 카테고리)
  - 파일: `src/main/resources/data.sql` 또는 `DataInitializer.java`
  - 확인 사항: 관리자 계정(`admin@koreazinc.com`) 로그인 가능 확인

#### Frontend 설정
- [x] **1.1.6** React 프로젝트 생성 (`create-react-app` 또는 Vite)
  - 디렉토리: `frontend/`
  - 확인 사항: `npm start` 실행 후 기본 화면 표시
  
- [x] **1.1.7** Tailwind CSS 설치 및 설정
  - 파일: `tailwind.config.js`, `src/index.css`
  - 확인 사항: Tailwind 유틸리티 클래스 정상 작동
  
- [x] **1.1.8** React Router 설정
  - 파일: `src/App.jsx`
  - 확인 사항: 기본 라우팅 (/, /login, /admin) 작동
  
- [x] **1.1.9** Axios 설정 (API 클라이언트)
  - 파일: `src/services/api.js`
  - 확인 사항: Base URL 설정, JWT 토큰 자동 첨부 인터셉터 작동

---

### 1.2 인증 기능 (JWT)

#### Backend
- [x] **1.2.1** User Entity 및 Repository 생성
  - 파일: `entity/User.java`, `repository/UserRepository.java`
  - 확인 사항: `users` 테이블과 정상 매핑, CRUD 메서드 작동
  
- [x] **1.2.2** JWT 유틸리티 클래스 구현
  - 파일: `security/JwtTokenProvider.java`
  - 확인 사항: 토큰 생성(createToken), 검증(validateToken), 사용자 정보 추출(getAuthentication) 기능 작동
  
- [x] **1.2.3** Spring Security 설정
  - 파일: `config/SecurityConfig.java`
  - 확인 사항: `/api/auth/**` 제외한 모든 엔드포인트 인증 필요
  
- [x] **1.2.4** UserDetailsService 구현
  - 파일: `security/CustomUserDetailsService.java`
  - 확인 사항: 이메일로 사용자 조회 및 인증 정보 반환
  
- [x] **1.2.5** POST /api/auth/login 구현
  - 파일: `controller/AuthController.java`, `service/AuthService.java`
  - 확인 사항:
    - ✅ 올바른 이메일/비밀번호로 200 OK + JWT 토큰 반환
    - ✅ 잘못된 이메일/비밀번호로 401 Unauthorized 반환 (SecurityConfig 설정 확인)
    - ✅ 토큰에 userId, email, role 정보 포함
  
- [x] **1.2.6** POST /api/auth/refresh 구현
  - 파일: `controller/AuthController.java`
  - 확인 사항:
    - ✅ 리프레시 토큰으로 새로운 액세스 토큰 발급
    - ✅ 만료된 리프레시 토큰은 401 반환 (validateToken 확인)
  
- [x] **1.2.7** POST /api/auth/logout 구현
  - 파일: `controller/AuthController.java`
  - 확인 사항: 로그아웃 후 해당 토큰으로 API 접근 불가 (Client-side removal assumed for MVP)

#### Frontend
- [x] **1.2.8** 로그인 페이지 UI 구현
  - 파일: `src/pages/auth/LoginPage.jsx`
  - 확인 사항:
    - ✅ 이메일/비밀번호 입력 폼 표시
    - ✅ 반응형 디자인 (모바일/PC)
  
- [x] **1.2.9** 로그인 API 연동
  - 파일: `src/services/authService.js`
  - 확인 사항:
    - ✅ 로그인 성공 시 JWT 토큰 localStorage 저장
    - ✅ 로그인 실패 시 에러 메시지 표시
  
- [x] **1.2.10** 인증 상태 관리 (Context API)
  - 파일: `src/contexts/AuthContext.jsx`
  - 확인 사항:
    - ✅ 로그인 상태 전역 관리
    - ✅ 페이지 새로고침 시에도 로그인 유지
  
- [x] **1.2.11** ProtectedRoute 컴포넌트 구현
  - 파일: `src/components/common/ProtectedRoute.jsx`
  - 확인 사항:
    - ✅ 미인증 사용자는 로그인 페이지로 리다이렉트
    - ✅ 관리자 전용 페이지는 ADMIN 권한 체크

---

### 1.3 사보 게시판 (사용자)

#### Backend
- [ ] **1.3.1** Article Entity 및 Repository 생성
  - 파일: `entity/Article.java`, `repository/ArticleRepository.java`
  - 확인 사항: Category, User와의 연관관계 설정 (`@ManyToOne`)
  
- [ ] **1.3.2** Category Entity 및 Repository 생성
  - 파일: `entity/Category.java`, `repository/CategoryRepository.java`
  - 확인 사항: 초기 카테고리 데이터 로드 확인
  
- [ ] **1.3.3** GET /api/articles (게시물 목록 조회)
  - 파일: `controller/ArticleController.java`, `service/ArticleService.java`
  - 확인 사항:
    - ✅ 페이징 처리 (기본 10개씩)
    - ✅ `categoryId` 파라미터로 필터링 가능
    - ✅ 정렬 (최신순, 조회수순) 작동
    - ✅ 썸네일, 요약, 작성자 정보 포함
  
- [ ] **1.3.4** GET /api/articles/{id} (게시물 상세 조회)
  - 파일: `controller/ArticleController.java`
  - 확인 사항:
    - ✅ 조회수 자동 증가 (세션당 1회만)
    - ✅ HTML 콘텐츠 정상 반환
    - ✅ 존재하지 않는 게시물은 404 반환
  
- [ ] **1.3.5** 조회수 중복 증가 방지 로직 구현
  - 파일: `service/ArticleViewService.java`
  - 확인 사항:
    - ✅ 같은 세션에서 동일 게시물 재조회 시 조회수 증가 안 함
    - ✅ 다른 브라우저/세션에서는 정상 증가

#### Frontend
- [ ] **1.3.6** 메인 페이지 UI 구현
  - 파일: `src/pages/main/MainPage.jsx`
  - 확인 사항:
    - ✅ 헤더(로고, 네비게이션), 푸터 포함
    - ✅ 반응형 레이아웃 (모바일/태블릿/PC)
  
- [ ] **1.3.7** 게시물 목록 컴포넌트 구현
  - 파일: `src/components/user/ArticleList.jsx`
  - 확인 사항:
    - ✅ 그리드 레이아웃 (썸네일, 제목, 요약)
    - ✅ 페이지네이션 버튼 작동
  
- [ ] **1.3.8** 카테고리 필터 탭 구현
  - 파일: `src/components/user/CategoryTabs.jsx`
  - 확인 사항:
    - ✅ "전체", "Special", "People", "Life" 탭 전환
    - ✅ 선택된 탭 스타일 변경
  
- [ ] **1.3.9** 게시물 상세 페이지 UI 구현
  - 파일: `src/pages/magazine/ArticleDetailPage.jsx`
  - 확인 사항:
    - ✅ HTML 콘텐츠 렌더링 (`dangerouslySetInnerHTML`)
    - ✅ 제목, 작성자, 작성일, 조회수 표시
    - ✅ 목록으로 돌아가기 버튼
  
- [ ] **1.3.10** 게시물 API 연동
  - 파일: `src/services/articleService.js`
  - 확인 사항:
    - ✅ 목록 조회 API 호출 성공
    - ✅ 상세 조회 API 호출 성공

---

### 1.4 사보 게시판 (관리자)

#### Backend
- [ ] **1.4.1** POST /api/articles (게시물 작성)
  - 파일: `controller/ArticleController.java`
  - 확인 사항:
    - ✅ ADMIN 권한 체크 (`@PreAuthorize("hasRole('ADMIN')")`)
    - ✅ 제목, 콘텐츠, 카테고리 필수 입력 검증
    - ✅ 썸네일 URL, 요약 정보 저장
    - ✅ `isPublished` 플래그로 발행/비발행 관리
  
- [ ] **1.4.2** PUT /api/articles/{id} (게시물 수정)
  - 파일: `controller/ArticleController.java`
  - 확인 사항:
    - ✅ 기존 게시물 업데이트 성공
    - ✅ 수정 시각 (`updatedAt`) 자동 갱신
  
- [ ] **1.4.3** DELETE /api/articles/{id} (게시물 삭제)
  - 파일: `controller/ArticleController.java`
  - 확인 사항:
    - ✅ 물리적 삭제 (DB에서 실제 제거)
    - ✅ 연관된 해시태그, 반응, 별점도 함께 삭제 (Cascade)
  
- [ ] **1.4.4** HTML Sanitization 구현
  - 파일: `util/HtmlSanitizerUtil.java`
  - 확인 사항:
    - ✅ `<script>`, `<iframe>` 태그 제거
    - ✅ 안전한 태그만 허용 (`<div>`, `<p>`, `<img>`, `<a>` 등)

#### Frontend
- [ ] **1.4.5** 관리자 레이아웃 구현
  - 파일: `src/pages/admin/AdminLayout.jsx`
  - 확인 사항:
    - ✅ 사이드바 메뉴 (게시물 관리, 이벤트 관리 등)
    - ✅ ADMIN 권한 없으면 접근 차단
  
- [ ] **1.4.6** HTML 에디터 통합 (TinyMCE)
  - 파일: `src/components/editor/HtmlEditor.jsx`
  - 확인 사항:
    - ✅ HTML 모드 지원
    - ✅ 이미지 삽입 가능
    - ✅ 소스 코드 편집 가능
  
- [ ] **1.4.7** 게시물 작성 폼 구현
  - 파일: `src/pages/admin/ArticleCreatePage.jsx`
  - 확인 사항:
    - ✅ 제목, 카테고리 선택, 콘텐츠 입력
    - ✅ 썸네일 이미지 업로드 버튼
    - ✅ 요약 정보 입력 (2줄 미만)
    - ✅ 발행/비발행 토글 버튼
  
- [ ] **1.4.8** 게시물 수정 폼 구현
  - 파일: `src/pages/admin/ArticleEditPage.jsx`
  - 확인 사항:
    - ✅ 기존 데이터 불러오기
    - ✅ 수정 후 저장 기능
  
- [ ] **1.4.9** 게시물 관리 목록 페이지
  - 파일: `src/pages/admin/ArticleManagePage.jsx`
  - 확인 사항:
    - ✅ 전체 게시물 테이블 표시 (발행/비발행 포함)
    - ✅ 수정/삭제 버튼
    - ✅ 검색 기능 (제목)

---

### 1.5 파일 업로드 기능

#### Backend
- [ ] **1.5.1** POST /api/files/upload (이미지 업로드)
  - 파일: `controller/FileController.java`, `service/FileService.java`
  - 확인 사항:
    - ✅ 파일 확장자 검증 (jpg, jpeg, png, gif만 허용)
    - ✅ MIME 타입 검증
    - ✅ 파일명 자동 생성 (`{category}_{timestamp}_{random}.{ext}`)
    - ✅ 저장 경로: `/uploads/{category}/{year}/{month}/`
    - ✅ 파일 크기 제한 (10MB)
  
- [ ] **1.5.2** 파일 경로 반환 API
  - 확인 사항:
    - ✅ 업로드 성공 시 상대 경로 반환 (`/uploads/...`)
  
- [ ] **1.5.3** Static 파일 서빙 설정
  - 파일: `config/WebConfig.java`
  - 확인 사항:
    - ✅ `/uploads/**` 경로로 파일 접근 가능
    - ✅ 브라우저에서 이미지 직접 조회 가능

#### Frontend
- [ ] **1.5.4** 이미지 업로드 컴포넌트 구현
  - 파일: `src/components/admin/ImageUploader.jsx`
  - 확인 사항:
    - ✅ 드래그 앤 드롭 지원
    - ✅ 미리보기 표시
    - ✅ 업로드 진행률 표시
  
- [ ] **1.5.5** 리소스 관리 페이지 구현
  - 파일: `src/pages/admin/ResourceManagePage.jsx`
  - 확인 사항:
    - ✅ 업로드된 이미지 목록 표시
    - ✅ 파일 경로 복사 버튼
    - ✅ 이미지 삭제 기능

---

### 1.6 카테고리 관리

#### Backend
- [ ] **1.6.1** GET /api/categories (카테고리 목록 조회)
  - 파일: `controller/CategoryController.java`
  - 확인 사항:
    - ✅ 활성 카테고리만 반환
    - ✅ `displayOrder` 순으로 정렬
  
- [ ] **1.6.2** POST /api/categories (카테고리 추가)
  - 파일: `controller/CategoryController.java`
  - 확인 사항:
    - ✅ ADMIN 권한 체크
    - ✅ 중복 이름 방지 (Unique 제약조건)

#### Frontend
- [ ] **1.6.3** 카테고리 관리 페이지 구현
  - 파일: `src/pages/admin/CategoryManagePage.jsx`
  - 확인 사항:
    - ✅ 카테고리 목록 표시
    - ✅ 새 카테고리 추가 폼
    - ✅ 순서 변경 기능 (선택사항)

---

### 1.7 공통 UI 컴포넌트

#### Frontend
- [ ] **1.7.1** Header 컴포넌트 구현
  - 파일: `src/components/common/Header.jsx`
  - 확인 사항:
    - ✅ 로고, 네비게이션 메뉴
    - ✅ 로그인/로그아웃 버튼
    - ✅ 관리자 메뉴 (ADMIN만 표시)
    - ✅ 모바일 햄버거 메뉴
  
- [ ] **1.7.2** Footer 컴포넌트 구현
  - 파일: `src/components/common/Footer.jsx`
  - 확인 사항:
    - ✅ 회사 정보, 저작권 표시
  
- [ ] **1.7.3** Loading Spinner 컴포넌트
  - 파일: `src/components/common/LoadingSpinner.jsx`
  - 확인 사항:
    - ✅ API 호출 중 표시
  
- [ ] **1.7.4** Error 메시지 컴포넌트
  - 파일: `src/components/common/ErrorMessage.jsx`
  - 확인 사항:
    - ✅ API 에러 시 사용자 친화적 메시지 표시

---

### Phase 1 검수 완료 기준
- [ ] **통합 테스트**: 로그인 → 게시물 조회 → 게시물 작성(관리자) → 업로드 → 카테고리 필터링 전체 플로우 정상 작동
- [ ] **반응형 테스트**: 모바일(375px), 태블릿(768px), PC(1920px) 화면에서 레이아웃 정상
- [ ] **보안 테스트**: 비인증 사용자의 관리자 API 접근 차단 확인
- [ ] **성능 테스트**: 게시물 100개 목록 조회 시 2초 이내 응답

---

## 🎯 Phase 2: 참여형 기능

**목표:** 사용자 참여형 기능 및 검색 고도화  
**시작일:** -  
**완료일:** -  
**상태:** ⏳ 대기 중

---

### 2.1 해시태그 기능

#### Backend
- [ ] **2.1.1** Hashtag Entity 및 Repository 생성
  - 파일: `entity/Hashtag.java`, `repository/HashtagRepository.java`
  - 확인 사항: `hashtags` 테이블 정상 생성
  
- [ ] **2.1.2** ArticleHashtag 중간 테이블 설정
  - 파일: `entity/Article.java` (ManyToMany 관계)
  - 확인 사항: 게시물-해시태그 매핑 정상 작동
  
- [ ] **2.1.3** 게시물 작성 시 해시태그 저장 로직
  - 파일: `service/ArticleService.java`
  - 확인 사항:
    - ✅ 신규 해시태그 자동 생성
    - ✅ 기존 해시태그 재사용
    - ✅ `usageCount` 자동 증가
  
- [ ] **2.1.4** GET /api/hashtags (인기 해시태그 조회)
  - 파일: `controller/HashtagController.java`
  - 확인 사항:
    - ✅ `usageCount` 상위 20개 반환
  
- [ ] **2.1.5** GET /api/articles?hashtag={tag} (해시태그 필터링)
  - 파일: `controller/ArticleController.java`
  - 확인 사항:
    - ✅ 특정 해시태그를 포함한 게시물만 조회

#### Frontend
- [ ] **2.1.6** 해시태그 입력 컴포넌트 구현
  - 파일: `src/components/admin/HashtagInput.jsx`
  - 확인 사항:
    - ✅ 태그 입력 후 Enter로 추가
    - ✅ 태그 삭제 버튼 (X)
  
- [ ] **2.1.7** 인기 해시태그 클라우드 표시
  - 파일: `src/components/user/HashtagCloud.jsx`
  - 확인 사항:
    - ✅ 사용 빈도에 따라 글자 크기 다르게
    - ✅ 클릭 시 해당 해시태그 게시물로 필터링
  
- [ ] **2.1.8** 게시물 상세에서 해시태그 클릭 가능
  - 파일: `src/pages/magazine/ArticleDetailPage.jsx`
  - 확인 사항:
    - ✅ 해시태그 클릭 시 필터링된 목록으로 이동

---

### 2.2 반응 기능

#### Backend
- [ ] **2.2.1** Reaction Entity 및 Repository 생성
  - 파일: `entity/Reaction.java`, `repository/ReactionRepository.java`
  - 확인 사항: `reactions` 테이블 정상 생성, Unique 제약조건 확인
  
- [ ] **2.2.2** POST /api/articles/{id}/reactions (반응 추가/변경)
  - 파일: `controller/ReactionController.java`
  - 확인 사항:
    - ✅ LIKE, SAD, ANGRY, FUNNY 중 하나 선택
    - ✅ 기존 반응 자동 변경
    - ✅ 반응 집계 데이터 함께 반환
  
- [ ] **2.2.3** DELETE /api/articles/{id}/reactions (반응 취소)
  - 확인 사항:
    - ✅ 반응 삭제 성공
  
- [ ] **2.2.4** 게시물 조회 시 반응 집계 포함
  - 파일: `service/ArticleService.java`
  - 확인 사항:
    - ✅ `{"LIKE": 30, "SAD": 2, ...}` 형식으로 반환

#### Frontend
- [ ] **2.2.5** 반응 버튼 컴포넌트 구현
  - 파일: `src/components/user/ReactionButtons.jsx`
  - 확인 사항:
    - ✅ 4개 이모지 버튼 (좋아요, 슬퍼요, 화나요, 웃겨요)
    - ✅ 선택된 반응 하이라이트
    - ✅ 각 반응 카운트 표시
  
- [ ] **2.2.6** 반응 API 연동
  - 파일: `src/services/reactionService.js`
  - 확인 사항:
    - ✅ 클릭 시 즉시 반영
    - ✅ 비인증 사용자는 로그인 유도

---

### 2.3 별점 기능

#### Backend
- [ ] **2.3.1** Rating Entity 및 Repository 생성
  - 파일: `entity/Rating.java`, `repository/RatingRepository.java`
  - 확인 사항: `ratings` 테이블 정상 생성
  
- [ ] **2.3.2** POST /api/articles/{id}/ratings (별점 추가/변경)
  - 파일: `controller/RatingController.java`
  - 확인 사항:
    - ✅ 1~5점 범위 검증
    - ✅ 평균 별점 자동 계산
  
- [ ] **2.3.3** 게시물 조회 시 평균 별점 포함
  - 확인 사항:
    - ✅ `averageRating`, `totalRatings` 필드 반환

#### Frontend
- [ ] **2.3.4** 별점 입력 컴포넌트 구현
  - 파일: `src/components/user/StarRating.jsx`
  - 확인 사항:
    - ✅ 별 5개 표시
    - ✅ 마우스 오버 시 미리보기
    - ✅ 클릭 시 별점 등록
  
- [ ] **2.3.5** 평균 별점 표시
  - 확인 사항:
    - ✅ 게시물 목록/상세에서 평균 별점 표시
    - ✅ 소수점 첫째 자리까지 (예: 4.5)

---

### 2.4 이벤트 게시판

#### Backend
- [ ] **2.4.1** Event Entity 및 Repository 생성
  - 파일: `entity/Event.java`, `repository/EventRepository.java`
  - 확인 사항: `events` 테이블 정상 생성
  
- [ ] **2.4.2** EventParticipant Entity 생성
  - 파일: `entity/EventParticipant.java`
  - 확인 사항: `event_participants` 테이블 생성
  
- [ ] **2.4.3** GET /api/events (이벤트 목록 조회)
  - 파일: `controller/EventController.java`
  - 확인 사항:
    - ✅ 진행 중/종료 필터링 가능
    - ✅ 참여자 수 포함
  
- [ ] **2.4.4** GET /api/events/{id} (이벤트 상세 조회)
  - 확인 사항:
    - ✅ 현재 사용자 참여 여부 포함
  
- [ ] **2.4.5** POST /api/events/{id}/participate (이벤트 참여)
  - 확인 사항:
    - ✅ 댓글 저장
    - ✅ 중복 참여 방지
    - ✅ 이벤트 기간 검증
  
- [ ] **2.4.6** POST /api/events/{id}/draw-winners (당첨자 추첨)
  - 확인 사항:
    - ✅ 랜덤으로 N명 선정
    - ✅ 당첨자 목록 반환
    - ✅ `isWinner` 플래그 업데이트
  
- [ ] **2.4.7** POST /api/events/{id}/announce-winners (당첨자 발표)
  - 확인 사항:
    - ✅ 발표 내용 저장
    - ✅ `winnersAnnounced` 플래그 true로 변경
  
- [ ] **2.4.8** POST /api/events (이벤트 생성 - 관리자)
  - 확인 사항:
    - ✅ 제목, 내용, 기간, 당첨자 수 필수 입력
  
- [ ] **2.4.9** PUT /api/events/{id} (이벤트 수정)
- [ ] **2.4.10** DELETE /api/events/{id} (이벤트 삭제)

#### Frontend
- [ ] **2.4.11** 이벤트 목록 페이지 구현
  - 파일: `src/pages/event/EventListPage.jsx`
  - 확인 사항:
    - ✅ 카드 레이아웃으로 표시
    - ✅ 진행 중/종료 구분 표시
  
- [ ] **2.4.12** 이벤트 상세 페이지 구현
  - 파일: `src/pages/event/EventDetailPage.jsx`
  - 확인 사항:
    - ✅ 이벤트 내용 표시
    - ✅ 참여 댓글 입력란
    - ✅ 당첨자 발표 영역 (발표 후 표시)
  
- [ ] **2.4.13** 이벤트 관리 페이지 (관리자)
  - 파일: `src/pages/admin/EventManagePage.jsx`
  - 확인 사항:
    - ✅ 이벤트 생성/수정/삭제
    - ✅ 참여자 목록 다운로드 (CSV)
    - ✅ 당첨자 추첨 버튼
    - ✅ 당첨자 발표 폼

---

### 2.5 아이디어 제안 기능

#### Backend
- [ ] **2.5.1** Idea Entity 및 Repository 생성
  - 파일: `entity/Idea.java`, `repository/IdeaRepository.java`
  - 확인 사항: `ideas` 테이블 정상 생성
  
- [ ] **2.5.2** POST /api/ideas (아이디어 제안)
  - 파일: `controller/IdeaController.java`
  - 확인 사항:
    - ✅ 제목, 내용 필수 입력
    - ✅ 상태 기본값 'PENDING'
  
- [ ] **2.5.3** GET /api/ideas (아이디어 목록 - 관리자)
  - 확인 사항:
    - ✅ 상태별 필터링 (PENDING, REVIEWED, ACCEPTED, REJECTED)
  
- [ ] **2.5.4** PUT /api/ideas/{id} (아이디어 상태 변경 - 관리자)
  - 확인 사항:
    - ✅ 관리자 답변 저장
    - ✅ 상태 변경

#### Frontend
- [ ] **2.5.5** 플로팅 버튼 구현
  - 파일: `src/components/user/IdeaFloatingButton.jsx`
  - 확인 사항:
    - ✅ 화면 하단 고정
    - ✅ 클릭 시 모달 팝업
  
- [ ] **2.5.6** 아이디어 제안 모달 구현
  - 파일: `src/components/user/IdeaModal.jsx`
  - 확인 사항:
    - ✅ 제목, 내용 입력 폼
    - ✅ 제출 버튼
  
- [ ] **2.5.7** 아이디어 관리 페이지 (관리자)
  - 파일: `src/pages/admin/IdeaManagePage.jsx`
  - 확인 사항:
    - ✅ 아이디어 목록 테이블
    - ✅ 상태 변경 드롭다운
    - ✅ 답변 입력란

---

### 2.6 팝업 관리

#### Backend
- [ ] **2.6.1** Popup Entity 및 Repository 생성
  - 파일: `entity/Popup.java`, `repository/PopupRepository.java`
  - 확인 사항: `popups` 테이블 정상 생성
  
- [ ] **2.6.2** GET /api/popups/active (활성 팝업 조회)
  - 파일: `controller/PopupController.java`
  - 확인 사항:
    - ✅ 현재 시각이 `startDate`~`endDate` 내인 팝업만 반환
    - ✅ `displayOrder` 순으로 정렬
  
- [ ] **2.6.3** POST /api/popups (팝업 생성 - 관리자)
  - 확인 사항:
    - ✅ 이미지형/텍스트형 구분
    - ✅ 기간 설정
  
- [ ] **2.6.4** PUT /api/popups/{id} (팝업 수정)
- [ ] **2.6.5** DELETE /api/popups/{id} (팝업 삭제)

#### Frontend
- [ ] **2.6.6** 팝업 표시 컴포넌트 구현
  - 파일: `src/components/common/PopupDisplay.jsx`
  - 확인 사항:
    - ✅ 메인 페이지 진입 시 자동 표시
    - ✅ 이미지형: 이미지만 표시
    - ✅ 텍스트형: HTML 콘텐츠 렌더링
    - ✅ "오늘 하루 보지 않기" 체크박스 (localStorage)
    - ✅ 닫기 버튼
  
- [ ] **2.6.7** 팝업 관리 페이지 (관리자)
  - 파일: `src/pages/admin/PopupManagePage.jsx`
  - 확인 사항:
    - ✅ 팝업 생성/수정/삭제
    - ✅ 미리보기 기능

---

### 2.7 롤링 배너 관리

#### Backend
- [ ] **2.7.1** Banner Entity 및 Repository 생성
  - 파일: `entity/Banner.java`, `repository/BannerRepository.java`
  - 확인 사항: `banners` 테이블 정상 생성
  
- [ ] **2.7.2** GET /api/banners/active (활성 배너 조회)
  - 파일: `controller/BannerController.java`
  - 확인 사항:
    - ✅ 활성 배너만 반환
    - ✅ `displayOrder` 순으로 정렬
  
- [ ] **2.7.3** POST /api/banners (배너 생성 - 관리자)
- [ ] **2.7.4** PUT /api/banners/{id} (배너 수정)
- [ ] **2.7.5** DELETE /api/banners/{id} (배너 삭제)

#### Frontend
- [ ] **2.7.6** 롤링 배너 컴포넌트 구현
  - 파일: `src/components/common/RollingBanner.jsx`
  - 확인 사항:
    - ✅ 자동 슬라이드 (5초 간격)
    - ✅ 이전/다음 버튼
    - ✅ 인디케이터 (점)
    - ✅ 클릭 시 링크 이동
  
- [ ] **2.7.7** 배너 관리 페이지 (관리자)
  - 파일: `src/pages/admin/BannerManagePage.jsx`
  - 확인 사항:
    - ✅ 배너 생성/수정/삭제
    - ✅ 순서 변경 (Drag & Drop 선택사항)

---

### Phase 2 검수 완료 기준
- [ ] **통합 테스트**: 게시물에 해시태그 추가 → 해시태그 필터링 → 반응 추가 → 별점 추가 → 이벤트 참여 → 아이디어 제안 전체 플로우 정상
- [ ] **UI/UX 테스트**: 모든 참여형 기능이 직관적이고 반응이 빠름
- [ ] **권한 테스트**: 일반 사용자는 관리 기능 접근 불가

---

## 🎯 Phase 3: 소셜 연동 및 고급 기능

**목표:** 외부 콘텐츠 통합 및 분석 기능  
**시작일:** -  
**완료일:** -  
**상태:** ⏳ 대기 중

---

### 3.1 YouTube 연동

#### Backend
- [ ] **3.1.1** SocialContent Entity 생성
  - 파일: `entity/SocialContent.java`, `repository/SocialContentRepository.java`
  - 확인 사항: `social_contents` 테이블 정상 생성
  
- [ ] **3.1.2** YouTube Data API 연동 서비스 구현
  - 파일: `service/YouTubeApiService.java`
  - 확인 사항:
    - ✅ API 키 설정 (`application.yml`)
    - ✅ 채널 ID로 최신 동영상 조회
    - ✅ 제목, 썸네일, 링크 추출
  
- [ ] **3.1.3** YouTube 콘텐츠 수집 스케줄러 구현
  - 파일: `scheduler/SocialContentScheduler.java`
  - 확인 사항:
    - ✅ 매일 새벽 2시 실행 (`@Scheduled`)
    - ✅ 중복 콘텐츠 저장 방지 (external_id 체크)
  
- [ ] **3.1.4** GET /api/social/youtube (YouTube 콘텐츠 조회)
  - 파일: `controller/SocialContentController.java`
  - 확인 사항:
    - ✅ 최신순 정렬
    - ✅ 페이징 지원

#### Frontend
- [ ] **3.1.5** YouTube 콘텐츠 페이지 구현
  - 파일: `src/pages/social/YouTubePage.jsx`
  - 확인 사항:
    - ✅ 썸네일 그리드 레이아웃
    - ✅ 클릭 시 YouTube 링크로 이동 (새 창)

---

### 3.2 Instagram 연동

#### Backend
- [ ] **3.2.1** Instagram Graph API 연동 서비스 구현
  - 파일: `service/InstagramApiService.java`
  - 확인 사항:
    - ✅ 액세스 토큰 설정
    - ✅ 계정의 최신 게시물 조회
    - ✅ 이미지 URL, 캡션 추출
  
- [ ] **3.2.2** Instagram 콘텐츠 수집 스케줄러
  - 파일: `scheduler/SocialContentScheduler.java`
  - 확인 사항:
    - ✅ 매일 새벽 2시 30분 실행
    - ✅ 중복 방지
  
- [ ] **3.2.3** GET /api/social/instagram (Instagram 콘텐츠 조회)
  - 확인 사항:
    - ✅ 최신순 정렬

#### Frontend
- [ ] **3.2.4** Instagram 콘텐츠 페이지 구현
  - 파일: `src/pages/social/InstagramPage.jsx`
  - 확인 사항:
    - ✅ 정사각형 썸네일 레이아웃
    - ✅ 클릭 시 Instagram 링크로 이동

---

### 3.3 고려아연 홈페이지 연동

#### Backend
- [ ] **3.3.1** 고려아연 홈페이지 연동 방식 확정
  - 확인 사항:
    - ✅ REST API 또는 DB 직접 연결 선택
    - ✅ 인증 정보 확보
  
- [ ] **3.3.2** 홈페이지 콘텐츠 수집 서비스 구현
  - 파일: `service/KgStoryService.java`
  - 확인 사항:
    - ✅ 최신 게시물 조회
  
- [ ] **3.3.3** 홈페이지 콘텐츠 수집 스케줄러
  - 확인 사항:
    - ✅ 매일 새벽 3시 실행
  
- [ ] **3.3.4** GET /api/social/homepage (홈페이지 콘텐츠 조회)

#### Frontend
- [ ] **3.3.5** 홈페이지 콘텐츠 섹션 추가
  - 파일: `src/pages/social/HomepagePage.jsx`

---

### 3.4 뉴스레터 발송

#### Backend
- [ ] **3.4.1** Newsletter Entity 생성
  - 파일: `entity/Newsletter.java`, `repository/NewsletterRepository.java`
  - 확인 사항: `newsletters`, `newsletter_articles` 테이블 생성
  
- [ ] **3.4.2** SMTP 서버 설정 확인
  - 파일: `application.yml`
  - 확인 사항:
    - ✅ SMTP 호스트, 포트, 인증 정보 설정
    - ✅ 테스트 이메일 발송 성공
  
- [ ] **3.4.3** 뉴스레터 HTML 템플릿 생성
  - 파일: `service/NewsletterService.java`
  - 확인 사항:
    - ✅ 6개 게시물을 2x3 그리드로 배치
    - ✅ 각 게시물 썸네일, 제목, 링크 포함
  
- [ ] **3.4.4** POST /api/newsletters (뉴스레터 발송)
  - 파일: `controller/NewsletterController.java`
  - 확인 사항:
    - ✅ 6개 게시물 선택
    - ✅ 전 직원 이메일 발송
    - ✅ 발송 결과 저장 (수신자 수)

#### Frontend
- [ ] **3.4.5** 뉴스레터 생성 페이지 (관리자)
  - 파일: `src/pages/admin/NewsletterCreatePage.jsx`
  - 확인 사항:
    - ✅ 게시물 선택 UI (6개 슬롯)
    - ✅ 각 슬롯 클릭 시 게시물 목록 모달
    - ✅ 미리보기 기능
    - ✅ 발송 버튼

---

### 3.5 대시보드 및 통계

#### Backend
- [ ] **3.5.1** 일일 방문자 수 집계 로직
  - 파일: `service/AnalyticsService.java`
  - 확인 사항:
    - ✅ 세션 기반 중복 제거
    - ✅ 매일 자정 집계
  
- [ ] **3.5.2** 조회수/반응/별점 집계 쿼리 최적화
  - 확인 사항:
    - ✅ 인기 게시물 조회 쿼리 2초 이내
  
- [ ] **3.5.3** GET /api/dashboard/stats (대시보드 통계)
  - 파일: `controller/DashboardController.java`
  - 확인 사항:
    - ✅ 일일 방문자 수
    - ✅ 전체 게시물/이벤트/아이디어 수
    - ✅ 인기 게시물 Top 10
    - ✅ 카테고리별 통계
    - ✅ 해시태그별 통계

#### Frontend
- [ ] **3.5.4** 대시보드 페이지 구현 (관리자)
  - 파일: `src/pages/admin/DashboardPage.jsx`
  - 확인 사항:
    - ✅ 주요 지표 카드 (방문자, 게시물 수 등)
    - ✅ 방문자 추이 그래프 (Chart.js 또는 Recharts)
    - ✅ 인기 게시물 테이블
    - ✅ 카테고리/해시태그 차트

---

### 3.6 네이버 애널리틱스 연동 (선택사항)

- [ ] **3.6.1** 네이버 애널리틱스 스크립트 삽입
  - 파일: `public/index.html`
  - 확인 사항:
    - ✅ 추적 코드 정상 작동

---

### Phase 3 검수 완료 기준
- [ ] **통합 테스트**: YouTube/Instagram 콘텐츠 자동 수집 → 뉴스레터 발송 → 대시보드 통계 조회 전체 플로우 정상
- [ ] **성능 테스트**: 외부 API 호출 시 타임아웃 처리 확인
- [ ] **이메일 테스트**: 뉴스레터가 스팸으로 분류되지 않고 정상 수신

---

## 🐛 발견된 이슈

> 검수자 에이전트가 테스트 중 발견한 이슈를 이 섹션에 기록합니다.

### 이슈 템플릿
```
#### Issue #N: [간단한 제목]
- **Phase**: Phase X
- **작업 번호**: X.X.X
- **발견 일시**: YYYY-MM-DD HH:MM
- **심각도**: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
- **설명**: 문제 상황 설명
- **재현 방법**:
  1. 단계 1
  2. 단계 2
- **예상 결과**: 정상 동작 설명
- **실제 결과**: 오류 발생 내용
- **해결 방법**: (개발자 에이전트가 작성)
- **상태**: ⏳ 대기 중 / 🔧 수정 중 / ✅ 해결됨
```

### 이슈 목록
*(현재 이슈 없음)*

---

## 📝 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|-------|
| 1.0 | 2026-01-08 | 초안 작성 | Claude |

---

## 🎯 에이전트 업무 가이드

### 개발자 에이전트
1. Phase 1부터 순서대로 작업 수행
2. 각 작업 완료 시 자체 테스트 실시
3. 완료된 작업은 검수자 에이전트에게 알림
4. 이슈 발생 시 `🐛 발견된 이슈` 섹션에 기록

### 검수자 에이전트
1. 개발자 에이전트가 완료한 작업 테스트
2. **테스트 통과 시**:
   - 해당 체크박스를 `[x]`로 변경
   - `plan.md` 파일 업데이트
   - 진행률 업데이트
3. **테스트 실패 시**:
   - `🐛 발견된 이슈` 섹션에 이슈 등록
   - 개발자 에이전트에게 수정 요청
4. Phase 단위 검수 완료 기준 확인

---

**문서 종료**
