# 전자사보 시스템 기술 명세서 (Tech Spec)

**프로젝트명:** 고려아연 전자사보 고도화 프로젝트  
**작성일:** 2026-01-08  
**버전:** 1.0  

---

## 📑 목차

1. [시스템 개요](#1-시스템-개요)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [데이터베이스 설계](#4-데이터베이스-설계)
5. [개발 계획 및 진행 관리](#5-개발-계획-및-진행-관리)
6. [API 명세](#6-api-명세)
7. [보안 고려사항](#7-보안-고려사항)
8. [성능 고려사항](#8-성능-고려사항)

---

## 1. 시스템 개요

### 1.1 프로젝트 목적
- 노후화된 전자사보 시스템을 모바일 친화적으로 재구축
- 소셜 미디어 콘텐츠 통합 제공
- 임직원 참여형 커뮤니티 플랫폼 구현
- 콘텐츠 분석 및 관리 기능 강화

### 1.2 주요 기능
1. **사보 게시판**: HTML 기반 사보 콘텐츠 관리
2. **소셜 콘텐츠**: YouTube, Instagram, 고려아연 홈페이지 연동
3. **임직원 참여**: 이벤트, 반응(이모지/별점), 아이디어 제안
4. **관리자 기능**: 콘텐츠 작성, 팝업 관리, 이벤트 관리, 뉴스레터 발송
5. **분석 기능**: 조회수, 반응 통계, 대시보드

### 1.3 사용자 유형
- **일반 사용자**: 고려아연 임직원 (로그인 필요)
- **관리자**: 커뮤니케이션팀 (사보 운영자)

---

## 2. 기술 스택

### 2.1 Backend
- **언어/프레임워크**: Java 17, Spring Boot 3.2.x
- **빌드 도구**: Gradle
- **ORM**: Spring Data JPA
- **인증**: Spring Security + JWT (JJWT 0.12.x)
- **API 문서화**: SpringDoc OpenAPI (Swagger)

### 2.2 Frontend
- **프레임워크**: React 18.x
- **상태 관리**: React Context API / Zustand
- **라우팅**: React Router v6
- **HTTP 클라이언트**: Axios
- **UI 라이브러리**: Tailwind CSS (고려사항: shadcn/ui)
- **폼 관리**: React Hook Form
- **에디터**: TinyMCE 또는 CKEditor (HTML 모드 지원)

### 2.3 Database
- **RDBMS**: PostgreSQL 16 (Docker 컨테이너)
- **연결 풀**: HikariCP

### 2.4 Infrastructure
- **개발 환경**: 로컬 PC
- **컨테이너**: Docker (PostgreSQL 서비스)
- **파일 스토리지**: 로컬 파일 시스템 (`/uploads` 디렉토리)

### 2.5 외부 API
- **YouTube Data API v3**: 고려아연 YouTube 채널 콘텐츠 수집
- **Instagram Graph API**: 고려아연 Instagram 콘텐츠 수집
- **고려아연 홈페이지 DB**: KG 스토리 콘텐츠 수집 (별도 API 제공 예정)
- **SMTP 서버**: 뉴스레터 이메일 발송

---

## 3. 시스템 아키텍처

### 3.1 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  (브라우저: 반응형 웹, 모바일 최적화)                      │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (JSON)
                     │ JWT 인증
┌────────────────────▼────────────────────────────────────┐
│              Spring Boot Backend                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Controller  │  │  Service    │  │ Repository  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │         External API Integration                 │   │
│  │  - YouTube Data API                              │   │
│  │  - Instagram Graph API                           │   │
│  │  - 고려아연 홈페이지 DB                            │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │ JDBC
┌────────────────────▼────────────────────────────────────┐
│            PostgreSQL Database                           │
│  (Docker Container)                                      │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│              Local File Storage                          │
│  /uploads/{category}/{year}/{month}/{filename}           │
└──────────────────────────────────────────────────────────┘
```

### 3.2 디렉토리 구조

#### Backend (Spring Boot)
```
src/
├── main/
│   ├── java/com/koreazinc/sabosystem/
│   │   ├── config/              # 설정 (Security, JWT, CORS)
│   │   ├── controller/          # REST API 컨트롤러
│   │   ├── service/             # 비즈니스 로직
│   │   ├── repository/          # JPA Repository
│   │   ├── entity/              # JPA 엔티티
│   │   ├── dto/                 # Request/Response DTO
│   │   ├── security/            # JWT, UserDetails
│   │   ├── exception/           # 예외 처리 (GlobalExceptionHandler)
│   │   └── util/                # 유틸리티 (파일 업로드 등)
│   └── resources/
│       ├── application.yml      # Spring Boot 설정
│       └── db/migration/        # Flyway 마이그레이션 (선택)
```

#### Frontend (React)
```
src/
├── components/             # 재사용 컴포넌트
│   ├── common/            # 공통 컴포넌트 (Header, Footer)
│   ├── editor/            # HTML 에디터 컴포넌트
│   ├── admin/             # 관리자 전용 컴포넌트
│   └── user/              # 사용자 전용 컴포넌트
├── pages/                 # 페이지 컴포넌트
│   ├── auth/              # 로그인, 회원가입
│   ├── main/              # 메인 페이지
│   ├── magazine/          # 웹진 (사보)
│   ├── social/            # 소셜 콘텐츠
│   ├── event/             # 이벤트
│   └── admin/             # 관리자 페이지
├── hooks/                 # Custom React Hooks
├── services/              # API 호출 서비스
├── contexts/              # React Context (상태 관리)
├── utils/                 # 유틸리티 함수
└── App.jsx                # 메인 앱
```

---

## 4. 데이터베이스 설계

### 4.1 ERD 개요

**핵심 엔티티:**
1. `users` - 사용자 (임직원)
2. `articles` - 사보 게시물
3. `categories` - 카테고리 마스터 (Special, People, Life 등)
4. `hashtags` - 해시태그
5. `article_hashtags` - 게시물-해시태그 매핑 (다대다)
6. `reactions` - 반응 (좋아요, 슬퍼요 등)
7. `ratings` - 별점
8. `events` - 이벤트
9. `event_participants` - 이벤트 참여자
10. `popups` - 팝업
11. `banners` - 롤링 배너
12. `social_contents` - 소셜 미디어 콘텐츠 (YouTube, Instagram)
13. `ideas` - 아이디어 제안
14. `newsletters` - 뉴스레터
15. `newsletter_articles` - 뉴스레터-게시물 매핑

### 4.2 테이블 정의

#### 4.2.1 users (사용자)
```sql
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- BCrypt 해시
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    role VARCHAR(20) NOT NULL,  -- 'USER' or 'ADMIN'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 4.2.2 categories (카테고리 마스터)
```sql
CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,  -- 'Special', 'People', 'Life' 등
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 초기 데이터
INSERT INTO categories (name, display_order) VALUES
('Special', 1),
('People', 2),
('Life', 3);
```

#### 4.2.3 hashtags (해시태그)
```sql
CREATE TABLE hashtags (
    hashtag_id BIGSERIAL PRIMARY KEY,
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    usage_count INT DEFAULT 0,  -- 사용 빈도 (분석용)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hashtags_name ON hashtags(tag_name);
```

#### 4.2.4 articles (사보 게시물)
```sql
CREATE TABLE articles (
    article_id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(category_id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,  -- HTML 콘텐츠
    summary TEXT,  -- 미리보기용 요약 (2줄 미만)
    thumbnail_url VARCHAR(500),  -- 썸네일 이미지 경로
    author_id BIGINT NOT NULL REFERENCES users(user_id),
    view_count INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_published ON articles(is_published, published_at);
CREATE INDEX idx_articles_view_count ON articles(view_count);
```

#### 4.2.5 article_hashtags (게시물-해시태그 매핑)
```sql
CREATE TABLE article_hashtags (
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    hashtag_id BIGINT NOT NULL REFERENCES hashtags(hashtag_id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, hashtag_id)
);

CREATE INDEX idx_article_hashtags_hashtag ON article_hashtags(hashtag_id);
```

#### 4.2.6 reactions (반응)
```sql
CREATE TABLE reactions (
    reaction_id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    reaction_type VARCHAR(20) NOT NULL,  -- 'LIKE', 'SAD', 'ANGRY', 'FUNNY'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id)  -- 사용자당 1개 반응만 가능
);

CREATE INDEX idx_reactions_article ON reactions(article_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);
```

#### 4.2.7 ratings (별점)
```sql
CREATE TABLE ratings (
    rating_id BIGSERIAL PRIMARY KEY,
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 1 AND score <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(article_id, user_id)  -- 사용자당 1개 별점만 가능
);

CREATE INDEX idx_ratings_article ON ratings(article_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
```

#### 4.2.8 events (이벤트)
```sql
CREATE TABLE events (
    event_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,  -- HTML 콘텐츠
    thumbnail_url VARCHAR(500),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    winner_count INT DEFAULT 0,  -- 당첨자 수
    winners_announced BOOLEAN DEFAULT FALSE,
    winner_announcement TEXT,  -- 당첨자 발표 내용
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_active ON events(is_active);
```

#### 4.2.9 event_participants (이벤트 참여자)
```sql
CREATE TABLE event_participants (
    participant_id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(event_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    comment TEXT,  -- 참여 댓글
    is_winner BOOLEAN DEFAULT FALSE,
    participated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)  -- 중복 참여 방지
);

CREATE INDEX idx_event_participants_event ON event_participants(event_id);
CREATE INDEX idx_event_participants_user ON event_participants(user_id);
CREATE INDEX idx_event_participants_winner ON event_participants(is_winner);
```

#### 4.2.10 popups (팝업)
```sql
CREATE TABLE popups (
    popup_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    popup_type VARCHAR(20) NOT NULL,  -- 'IMAGE' or 'TEXT'
    image_url VARCHAR(500),  -- 이미지형일 경우
    content TEXT,  -- 텍스트형일 경우 (HTML)
    link_url VARCHAR(500),  -- 클릭 시 이동할 URL
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_popups_active ON popups(is_active, start_date, end_date);
```

#### 4.2.11 banners (롤링 배너)
```sql
CREATE TABLE banners (
    banner_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_active ON banners(is_active, display_order);
```

#### 4.2.12 social_contents (소셜 미디어 콘텐츠)
```sql
CREATE TABLE social_contents (
    content_id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(20) NOT NULL,  -- 'YOUTUBE', 'INSTAGRAM', 'HOMEPAGE'
    external_id VARCHAR(255) NOT NULL,  -- 외부 플랫폼의 콘텐츠 ID
    title VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(500),
    link_url VARCHAR(500) NOT NULL,
    published_at TIMESTAMP,
    fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(platform, external_id)  -- 중복 수집 방지
);

CREATE INDEX idx_social_contents_platform ON social_contents(platform);
CREATE INDEX idx_social_contents_published ON social_contents(published_at);
```

#### 4.2.13 ideas (아이디어 제안)
```sql
CREATE TABLE ideas (
    idea_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',  -- 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'
    admin_comment TEXT,  -- 관리자 답변
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ideas_user ON ideas(user_id);
CREATE INDEX idx_ideas_status ON ideas(status);
```

#### 4.2.14 newsletters (뉴스레터)
```sql
CREATE TABLE newsletters (
    newsletter_id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,  -- 이메일 제목
    sent_at TIMESTAMP,
    recipient_count INT DEFAULT 0,
    created_by BIGINT NOT NULL REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletters_sent ON newsletters(sent_at);
```

#### 4.2.15 newsletter_articles (뉴스레터-게시물 매핑)
```sql
CREATE TABLE newsletter_articles (
    newsletter_id BIGINT NOT NULL REFERENCES newsletters(newsletter_id) ON DELETE CASCADE,
    article_id BIGINT NOT NULL REFERENCES articles(article_id) ON DELETE CASCADE,
    display_order INT NOT NULL,  -- 뉴스레터 내 순서 (1~6)
    PRIMARY KEY (newsletter_id, article_id)
);

CREATE INDEX idx_newsletter_articles_newsletter ON newsletter_articles(newsletter_id);
```

### 4.3 데이터베이스 초기화 스크립트

```sql
-- schema.sql (초기 테이블 생성)
-- 위의 CREATE TABLE 문들을 순서대로 실행

-- data.sql (초기 데이터)
-- 1. 관리자 계정 생성 (비밀번호: admin123, BCrypt 해시)
INSERT INTO users (email, password, name, department, role) VALUES
('admin@koreazinc.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AzHuEVZW8Yxp6G', '관리자', '커뮤니케이션팀', 'ADMIN');

-- 2. 테스트용 일반 사용자 (비밀번호: user123)
INSERT INTO users (email, password, name, department, role) VALUES
('user1@koreazinc.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AzHuEVZW8Yxp6G', '홍길동', '생산부', 'USER'),
('user2@koreazinc.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AzHuEVZW8Yxp6G', '김철수', '인사팀', 'USER');

-- 3. 기본 카테고리 생성
INSERT INTO categories (name, display_order) VALUES
('Special', 1),
('People', 2),
('Life', 3);

-- 4. 테스트용 해시태그
INSERT INTO hashtags (tag_name, usage_count) VALUES
('안전', 5),
('성과', 8),
('채용', 3),
('환경', 4);

-- 5. 샘플 게시물 (선택사항 - 개발 테스트용)
INSERT INTO articles (category_id, title, content, summary, thumbnail_url, author_id, view_count, is_published, published_at) VALUES
(1, '2024년 고려아연 주요 성과', '<div><h2>주요 성과</h2><p>올해 고려아연은...</p></div>', '2024년 주요 성과를 소개합니다.', '/uploads/articles/2024/01/sample1.jpg', 1, 0, true, NOW()),
(2, '신입사원 인터뷰', '<div><h2>신입사원의 이야기</h2><p>신입사원 김철수씨를...</p></div>', '신입사원의 생생한 이야기', '/uploads/articles/2024/01/sample2.jpg', 1, 0, true, NOW());
```

**참고**: 샘플 게시물은 개발 환경에서만 사용하고, 운영 환경에는 포함하지 않습니다.

---

## 5. 개발 계획 및 진행 관리

### 5.1 작업 관리 방식

이 프로젝트는 **Phase별 단계적 개발**을 진행하며, 각 Phase는 **개발자 에이전트**와 **검수자 에이전트**의 협업으로 완성됩니다.

**작업 진행 상황은 `plan.md` 파일에서 관리합니다.**

### 5.2 Phase 개요

**Phase 1: MVP (핵심 기능)** - 예상 기간 2-3주
- 로그인/인증 (JWT)
- 사보 게시판 CRUD
- 파일 업로드
- 카테고리 관리
- 기본 UI/UX

**Phase 2: 참여형 기능** - 예상 기간 2-3주
- 해시태그 검색
- 반응 (좋아요, 슬퍼요 등)
- 별점
- 이벤트 게시판
- 아이디어 제안
- 팝업/배너 관리

**Phase 3: 소셜 연동 및 고급 기능** - 예상 기간 3-4주
- YouTube/Instagram 연동
- 고려아연 홈페이지 연동
- 뉴스레터 발송
- 대시보드 및 통계

### 5.3 작업 흐름

```
1. 개발자 에이전트 → 기능 구현
2. 개발자 에이전트 → 자체 테스트
3. 검수자 에이전트 → 통합 테스트
4. 검수자 에이전트 → plan.md 체크박스 업데이트
5. 다음 작업으로 이동
```

### 5.4 상세 작업 목록

**상세한 작업 항목 및 체크리스트는 `plan.md`를 참조하세요.**

`plan.md`에는 다음 내용이 포함되어 있습니다:
- Phase별 세부 작업 체크리스트 (총 105개 항목)
- 각 작업의 확인 사항
- 이슈 트래킹
- 진행률 표시

---

## 6. API 명세

### 6.1 인증 API

#### POST /api/auth/login
**설명:** 로그인 (JWT 토큰 발급)

**Request:**
```json
{
  "email": "user@koreazinc.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "userId": 1,
    "email": "user@koreazinc.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "INVALID_CREDENTIALS",
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

---

#### POST /api/auth/refresh
**설명:** 액세스 토큰 갱신

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

---

#### POST /api/auth/logout
**설명:** 로그아웃 (리프레시 토큰 무효화)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "message": "로그아웃되었습니다."
}
```

---

### 6.2 사보 게시판 API

#### GET /api/articles
**설명:** 게시물 목록 조회 (페이징, 필터링)

**Query Parameters:**
- `page` (int, optional, default: 0): 페이지 번호
- `size` (int, optional, default: 10): 페이지 크기
- `categoryId` (long, optional): 카테고리 ID 필터
- `hashtag` (string, optional): 해시태그 필터
- `sort` (string, optional, default: "publishedAt,desc"): 정렬 기준
  - 가능한 값: `publishedAt,desc`, `viewCount,desc`, `title,asc`

**Response (200 OK):**
```json
{
  "content": [
    {
      "articleId": 1,
      "categoryId": 1,
      "categoryName": "Special",
      "title": "2024년 고려아연 주요 성과",
      "summary": "올해 고려아연이 이룬 성과들을 소개합니다.",
      "thumbnailUrl": "/uploads/articles/2024/01/thumbnail_1.jpg",
      "authorName": "홍길동",
      "viewCount": 123,
      "publishedAt": "2024-01-15T09:00:00",
      "hashtags": ["성과", "2024"],
      "reactionCount": 45,
      "averageRating": 4.5
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": "publishedAt,desc"
  },
  "totalElements": 100,
  "totalPages": 10,
  "last": false
}
```

---

#### GET /api/articles/{id}
**설명:** 게시물 상세 조회 (조회수 증가)

**Response (200 OK):**
```json
{
  "articleId": 1,
  "categoryId": 1,
  "categoryName": "Special",
  "title": "2024년 고려아연 주요 성과",
  "content": "<div>HTML 콘텐츠...</div>",
  "summary": "올해 고려아연이 이룬 성과들을 소개합니다.",
  "thumbnailUrl": "/uploads/articles/2024/01/thumbnail_1.jpg",
  "authorId": 5,
  "authorName": "홍길동",
  "viewCount": 124,
  "publishedAt": "2024-01-15T09:00:00",
  "createdAt": "2024-01-10T10:00:00",
  "updatedAt": "2024-01-12T14:00:00",
  "hashtags": [
    {"hashtagId": 1, "tagName": "성과"},
    {"hashtagId": 2, "tagName": "2024"}
  ],
  "reactions": {
    "LIKE": 30,
    "SAD": 2,
    "ANGRY": 1,
    "FUNNY": 12
  },
  "averageRating": 4.5,
  "totalRatings": 20,
  "userReaction": "LIKE",  // 현재 사용자의 반응 (null 가능)
  "userRating": 5  // 현재 사용자의 별점 (null 가능)
}
```

**Response (404 Not Found):**
```json
{
  "error": "ARTICLE_NOT_FOUND",
  "message": "게시물을 찾을 수 없습니다."
}
```

---

#### POST /api/articles
**설명:** 게시물 작성 (관리자 전용)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "categoryId": 1,
  "title": "새로운 사보 게시물",
  "content": "<div>HTML 콘텐츠...</div>",
  "summary": "게시물 요약입니다.",
  "thumbnailUrl": "/uploads/articles/2024/01/thumbnail_2.jpg",
  "hashtags": ["신규", "공지"],
  "isPublished": true
}
```

**Response (201 Created):**
```json
{
  "articleId": 2,
  "message": "게시물이 작성되었습니다."
}
```

**Response (403 Forbidden):**
```json
{
  "error": "ACCESS_DENIED",
  "message": "관리자만 접근할 수 있습니다."
}
```

---

#### PUT /api/articles/{id}
**설명:** 게시물 수정 (관리자 전용)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "categoryId": 1,
  "title": "수정된 제목",
  "content": "<div>수정된 HTML 콘텐츠...</div>",
  "summary": "수정된 요약입니다.",
  "thumbnailUrl": "/uploads/articles/2024/01/thumbnail_2_updated.jpg",
  "hashtags": ["수정", "업데이트"],
  "isPublished": true
}
```

**Response (200 OK):**
```json
{
  "message": "게시물이 수정되었습니다."
}
```

---

#### DELETE /api/articles/{id}
**설명:** 게시물 삭제 (관리자 전용)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "message": "게시물이 삭제되었습니다."
}
```

---

### 6.3 카테고리 API

#### GET /api/categories
**설명:** 카테고리 목록 조회

**Response (200 OK):**
```json
{
  "categories": [
    {
      "categoryId": 1,
      "name": "Special",
      "displayOrder": 1,
      "isActive": true
    },
    {
      "categoryId": 2,
      "name": "People",
      "displayOrder": 2,
      "isActive": true
    },
    {
      "categoryId": 3,
      "name": "Life",
      "displayOrder": 3,
      "isActive": true
    }
  ]
}
```

---

#### POST /api/categories
**설명:** 카테고리 추가 (관리자 전용)

**Request:**
```json
{
  "name": "보도자료",
  "displayOrder": 4
}
```

**Response (201 Created):**
```json
{
  "categoryId": 4,
  "message": "카테고리가 추가되었습니다."
}
```

---

### 6.4 해시태그 API

#### GET /api/hashtags
**설명:** 인기 해시태그 조회 (사용 빈도 상위 N개)

**Query Parameters:**
- `limit` (int, optional, default: 20): 조회할 해시태그 개수

**Response (200 OK):**
```json
{
  "hashtags": [
    {"hashtagId": 1, "tagName": "성과", "usageCount": 45},
    {"hashtagId": 2, "tagName": "안전", "usageCount": 38},
    {"hashtagId": 3, "tagName": "채용", "usageCount": 30}
  ]
}
```

---

### 6.5 반응 API

#### POST /api/articles/{id}/reactions
**설명:** 게시물에 반응 추가/변경

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "reactionType": "LIKE"
}
```
- 가능한 값: `LIKE`, `SAD`, `ANGRY`, `FUNNY`

**Response (200 OK):**
```json
{
  "message": "반응이 등록되었습니다.",
  "reactions": {
    "LIKE": 31,
    "SAD": 2,
    "ANGRY": 1,
    "FUNNY": 12
  }
}
```

---

#### DELETE /api/articles/{id}/reactions
**설명:** 게시물 반응 취소

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "message": "반응이 취소되었습니다.",
  "reactions": {
    "LIKE": 30,
    "SAD": 2,
    "ANGRY": 1,
    "FUNNY": 12
  }
}
```

---

### 6.6 별점 API

#### POST /api/articles/{id}/ratings
**설명:** 게시물에 별점 추가/변경

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "score": 5
}
```
- `score`: 1~5 사이의 정수

**Response (200 OK):**
```json
{
  "message": "별점이 등록되었습니다.",
  "averageRating": 4.6,
  "totalRatings": 21
}
```

---

### 6.7 이벤트 API

#### GET /api/events
**설명:** 이벤트 목록 조회 (진행 중 + 예정)

**Query Parameters:**
- `status` (string, optional): 필터 (`active`, `ended`, `all`)

**Response (200 OK):**
```json
{
  "events": [
    {
      "eventId": 1,
      "title": "설문조사 이벤트",
      "thumbnailUrl": "/uploads/events/2024/01/event_1.jpg",
      "startDate": "2024-01-01T00:00:00",
      "endDate": "2024-01-31T23:59:59",
      "isActive": true,
      "participantCount": 120,
      "winnersAnnounced": false
    }
  ]
}
```

---

#### GET /api/events/{id}
**설명:** 이벤트 상세 조회

**Response (200 OK):**
```json
{
  "eventId": 1,
  "title": "설문조사 이벤트",
  "content": "<div>이벤트 내용...</div>",
  "thumbnailUrl": "/uploads/events/2024/01/event_1.jpg",
  "startDate": "2024-01-01T00:00:00",
  "endDate": "2024-01-31T23:59:59",
  "isActive": true,
  "winnerCount": 5,
  "winnersAnnounced": false,
  "winnerAnnouncement": null,
  "participantCount": 120,
  "userParticipated": true,  // 현재 사용자 참여 여부
  "userComment": "좋은 이벤트네요!"  // 현재 사용자 댓글
}
```

---

#### POST /api/events/{id}/participate
**설명:** 이벤트 참여 (댓글 작성)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "comment": "참여합니다!"
}
```

**Response (200 OK):**
```json
{
  "message": "이벤트에 참여하였습니다."
}
```

**Response (400 Bad Request):**
```json
{
  "error": "ALREADY_PARTICIPATED",
  "message": "이미 참여한 이벤트입니다."
}
```

---

#### POST /api/events/{id}/draw-winners
**설명:** 당첨자 랜덤 추첨 (관리자 전용)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Response (200 OK):**
```json
{
  "message": "당첨자 5명이 추첨되었습니다.",
  "winners": [
    {"userId": 10, "name": "홍길동", "email": "hong@koreazinc.com"},
    {"userId": 25, "name": "김철수", "email": "kim@koreazinc.com"}
  ]
}
```

---

#### POST /api/events/{id}/announce-winners
**설명:** 당첨자 발표 (관리자 전용)

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "announcement": "축하합니다! 당첨자는 다음과 같습니다..."
}
```

**Response (200 OK):**
```json
{
  "message": "당첨자가 발표되었습니다."
}
```

---

### 6.8 파일 업로드 API

#### POST /api/files/upload
**설명:** 이미지 파일 업로드 (관리자 전용)

**Request Header:**
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request:**
```
file: (binary)
category: "articles"  // 또는 "events", "banners", "popups"
```

**Response (200 OK):**
```json
{
  "fileName": "image_20240108_123456.jpg",
  "filePath": "/uploads/articles/2024/01/image_20240108_123456.jpg",
  "fileSize": 245678,
  "contentType": "image/jpeg"
}
```

**Response (400 Bad Request):**
```json
{
  "error": "INVALID_FILE_TYPE",
  "message": "허용되지 않는 파일 형식입니다. (jpg, jpeg, png, gif만 가능)"
}
```

**제약사항:**
- 최대 파일 크기: 10MB
- 허용 확장자: `.jpg`, `.jpeg`, `.png`, `.gif`
- 파일명 자동 생성: `{category}_{timestamp}_{random}.{ext}`

---

### 6.9 아이디어 제안 API

#### POST /api/ideas
**설명:** 아이디어 제안 등록

**Request Header:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "title": "새로운 사보 주제 제안",
  "content": "임직원 건강 관련 콘텐츠를 추가하면 좋을 것 같습니다."
}
```

**Response (201 Created):**
```json
{
  "ideaId": 1,
  "message": "아이디어가 제출되었습니다."
}
```

---

#### GET /api/ideas (관리자 전용)
**설명:** 아이디어 목록 조회

**Response (200 OK):**
```json
{
  "ideas": [
    {
      "ideaId": 1,
      "userName": "홍길동",
      "title": "새로운 사보 주제 제안",
      "content": "임직원 건강 관련...",
      "status": "PENDING",
      "createdAt": "2024-01-08T10:00:00"
    }
  ]
}
```

---

### 6.10 팝업 API

#### GET /api/popups/active
**설명:** 현재 활성화된 팝업 조회 (노출 기간 내)

**Response (200 OK):**
```json
{
  "popups": [
    {
      "popupId": 1,
      "title": "1월 이벤트 알림",
      "popupType": "IMAGE",
      "imageUrl": "/uploads/popups/2024/01/popup_1.jpg",
      "linkUrl": "/events/1",
      "displayOrder": 1
    }
  ]
}
```

---

### 6.11 배너 API

#### GET /api/banners/active
**설명:** 활성화된 롤링 배너 조회

**Response (200 OK):**
```json
{
  "banners": [
    {
      "bannerId": 1,
      "title": "2024년 신년사",
      "imageUrl": "/uploads/banners/2024/01/banner_1.jpg",
      "linkUrl": "/articles/1",
      "displayOrder": 1
    }
  ]
}
```

---

### 6.12 소셜 콘텐츠 API (Phase 3)

#### GET /api/social/youtube
**설명:** YouTube 콘텐츠 목록 조회

**Response (200 OK):**
```json
{
  "contents": [
    {
      "contentId": 1,
      "platform": "YOUTUBE",
      "title": "고려아연 안전캠페인",
      "thumbnailUrl": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "linkUrl": "https://www.youtube.com/watch?v=abc123",
      "publishedAt": "2024-01-05T10:00:00"
    }
  ]
}
```

---

#### GET /api/social/instagram
**설명:** Instagram 콘텐츠 목록 조회

**Response (200 OK):**
```json
{
  "contents": [
    {
      "contentId": 2,
      "platform": "INSTAGRAM",
      "description": "고려아연 신입사원 환영식",
      "thumbnailUrl": "https://instagram.fxxx.jpg",
      "linkUrl": "https://www.instagram.com/p/abc123/",
      "publishedAt": "2024-01-07T15:00:00"
    }
  ]
}
```

---

### 6.13 뉴스레터 API (Phase 3)

#### POST /api/newsletters
**설명:** 뉴스레터 생성 및 발송 (관리자 전용)

**Request:**
```json
{
  "title": "1월 사보 뉴스레터",
  "subject": "[고려아연] 1월 사보 소식을 전해드립니다",
  "articleIds": [1, 2, 3, 4, 5, 6]  // 6개 게시물 선택
}
```

**Response (200 OK):**
```json
{
  "newsletterId": 1,
  "message": "뉴스레터가 발송되었습니다.",
  "recipientCount": 520
}
```

**구현 예시 (Backend):**
```java
@Service
public class NewsletterService {
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendNewsletter(Newsletter newsletter, List<Article> articles) {
        List<User> recipients = userRepository.findAllActiveUsers();
        
        String htmlContent = buildNewsletterHtml(articles);
        
        for (User user : recipients) {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(user.getEmail());
            helper.setSubject(newsletter.getSubject());
            helper.setText(htmlContent, true);  // HTML 모드
            
            mailSender.send(message);
        }
    }
    
    private String buildNewsletterHtml(List<Article> articles) {
        // 6개 게시물을 2x3 그리드로 배치한 HTML 템플릿 생성
        // Thymeleaf 또는 직접 String Builder 사용
        return "<html><body>...</body></html>";
    }
}
```

---

### 6.14 대시보드 API (Phase 3)

#### GET /api/dashboard/stats
**설명:** 대시보드 통계 조회 (관리자 전용)

**Response (200 OK):**
```json
{
  "dailyVisitors": 125,  // 오늘 방문자 수
  "totalArticles": 230,
  "totalEvents": 8,
  "totalIdeas": 45,
  "topArticles": [
    {
      "articleId": 1,
      "title": "2024년 성과",
      "viewCount": 520,
      "averageRating": 4.8
    }
  ],
  "categoryStats": [
    {"categoryName": "Special", "articleCount": 80, "totalViews": 12000},
    {"categoryName": "People", "articleCount": 70, "totalViews": 9500},
    {"categoryName": "Life", "articleCount": 80, "totalViews": 10500}
  ],
  "hashtagStats": [
    {"tagName": "성과", "usageCount": 45},
    {"tagName": "안전", "usageCount": 38}
  ]
}
```

---

## 7. 보안 고려사항

### 7.1 인증 및 권한 관리

#### JWT 토큰 구조
```json
{
  "sub": "user@koreazinc.com",  // 사용자 이메일
  "userId": 1,
  "role": "USER",  // or "ADMIN"
  "iat": 1704700800,  // 발급 시간
  "exp": 1704704400   // 만료 시간 (1시간)
}
```

#### 액세스 토큰 vs 리프레시 토큰
- **액세스 토큰**: 1시간 유효, API 요청 시 사용
- **리프레시 토큰**: 7일 유효, 액세스 토큰 갱신 전용

#### 권한 체크
- **USER**: 읽기, 반응, 별점, 이벤트 참여, 아이디어 제안
- **ADMIN**: 위 모든 권한 + CRUD 작업 (게시물, 이벤트, 팝업, 배너 등)

---

### 7.2 XSS 방어

#### 문제점
- 관리자가 작성한 HTML 콘텐츠를 **그대로 렌더링**하면 악성 스크립트 주입 가능

#### 해결책
1. **Backend**: HTML Sanitization
   - 라이브러리: **OWASP Java HTML Sanitizer**
   - 허용 태그만 통과 (`<div>`, `<p>`, `<img>`, `<a>` 등)
   - `<script>`, `<iframe>` 등 위험 태그 차단

2. **Frontend**: React의 기본 XSS 방어
   - `dangerouslySetInnerHTML` 사용 시 주의
   - DOMPurify 라이브러리로 클라이언트 측 추가 필터링

#### 구현 예시 (Backend)
```java
import org.owasp.html.PolicyFactory;
import org.owasp.html.Sanitizers;

public String sanitizeHtml(String html) {
    PolicyFactory policy = Sanitizers.FORMATTING
        .and(Sanitizers.BLOCKS)
        .and(Sanitizers.IMAGES)
        .and(Sanitizers.LINKS)
        .and(Sanitizers.STYLES);
    
    return policy.sanitize(html);
}
```

---

### 7.3 SQL Injection 방어

#### 해결책
- **JPA/Hibernate 사용**: 자동으로 PreparedStatement 생성
- **Native Query 사용 금지**: 불가피할 경우 반드시 파라미터 바인딩

#### 예시 (안전한 방법)
```java
@Query("SELECT a FROM Article a WHERE a.title LIKE %:keyword%")
List<Article> searchByTitle(@Param("keyword") String keyword);
```

---

### 7.4 파일 업로드 보안

#### 위험 요소
- 악성 파일 업로드 (PHP, JSP 등)
- 경로 탐색 공격 (Path Traversal)

#### 해결책
1. **파일 확장자 검증**: 화이트리스트 방식 (`.jpg`, `.png`, `.gif`만 허용)
2. **MIME 타입 검증**: `Content-Type` 헤더 확인
3. **파일명 자동 생성**: 사용자 입력 파일명 사용 금지
4. **저장 경로 고정**: `/uploads/{category}/{year}/{month}/` 패턴 강제
5. **파일 크기 제한**: 10MB 이하

#### 구현 예시
```java
public String uploadFile(MultipartFile file, String category) {
    // 1. 확장자 검증
    String originalFilename = file.getOriginalFilename();
    String extension = getExtension(originalFilename);
    if (!Arrays.asList("jpg", "jpeg", "png", "gif").contains(extension)) {
        throw new InvalidFileTypeException();
    }
    
    // 2. MIME 타입 검증
    String contentType = file.getContentType();
    if (!contentType.startsWith("image/")) {
        throw new InvalidFileTypeException();
    }
    
    // 3. 파일명 자동 생성
    String newFilename = String.format("%s_%d_%s.%s", 
        category, 
        System.currentTimeMillis(), 
        UUID.randomUUID().toString().substring(0, 8),
        extension
    );
    
    // 4. 저장 경로 생성
    String uploadDir = String.format("/uploads/%s/%s/", 
        category, 
        LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"))
    );
    
    // 5. 파일 저장
    Path filePath = Paths.get(uploadDir, newFilename);
    Files.createDirectories(filePath.getParent());
    Files.copy(file.getInputStream(), filePath);
    
    return filePath.toString();
}
```

---

### 7.5 CORS 설정

#### 개발 환경
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")  // React 개발 서버 (Vite)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

#### 운영 환경
- 프론트엔드와 백엔드가 **같은 도메인**에서 서비스될 경우: CORS 불필요
- 다른 도메인일 경우: `allowedOrigins`를 운영 도메인으로 제한

---

### 7.6 비밀번호 보안

#### 해싱 알고리즘
- **BCrypt**: Spring Security 기본 제공
- Salt 자동 생성 (Rainbow Table 공격 방어)
- 비용 팩터(Cost Factor): 10~12 권장

#### 구현 예시
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(10);
}

// 회원가입 시
String hashedPassword = passwordEncoder.encode(rawPassword);
user.setPassword(hashedPassword);

// 로그인 시
boolean matches = passwordEncoder.matches(rawPassword, user.getPassword());
```

---

## 8. 성능 고려사항

### 8.1 데이터베이스 최적화

#### 인덱스 전략
- **조회 성능 향상**을 위한 인덱스 (이미 schema에 포함)
  - `users.email` (로그인 시 빈번한 조회)
  - `articles.category_id` (카테고리 필터링)
  - `articles.published_at` (최신순 정렬)
  - `article_hashtags.hashtag_id` (해시태그 검색)

#### N+1 문제 해결
- **문제**: 게시물 목록 조회 시 각 게시물의 해시태그를 개별 쿼리로 조회
- **해결**: `@EntityGraph` 또는 `JOIN FETCH` 사용

```java
@Query("SELECT DISTINCT a FROM Article a " +
       "LEFT JOIN FETCH a.hashtags " +
       "WHERE a.isPublished = true " +
       "ORDER BY a.publishedAt DESC")
List<Article> findAllWithHashtags(Pageable pageable);
```

---

### 8.2 캐싱 전략

#### 조회수 업데이트 최적화
**문제점**: 매 조회마다 DB UPDATE → 높은 부하

**해결책**: 
1. **Redis 카운터 사용** (Phase 3)
   - 조회수를 Redis에 먼저 기록
   - 10분마다 배치로 DB 동기화
   
2. **간단한 방법** (Phase 1~2)
   - 사용자 세션당 1회만 조회수 증가 (중복 방지)
   - `Set<Long>` 자료구조로 조회한 게시물 ID 저장 (메모리 캐시)

```java
@Service
public class ArticleViewService {
    private final Map<String, Set<Long>> userViewedArticles = new ConcurrentHashMap<>();
    
    public void incrementViewCount(Long articleId, String sessionId) {
        Set<Long> viewedArticles = userViewedArticles
            .computeIfAbsent(sessionId, k -> ConcurrentHashMap.newKeySet());
        
        if (viewedArticles.add(articleId)) {
            // 최초 조회만 카운트 증가
            articleRepository.incrementViewCount(articleId);
        }
    }
}
```

#### Redis 도입 (Phase 3)
- **캐싱 대상**:
  - 카테고리 목록 (변경 빈도 낮음)
  - 인기 해시태그 (1시간 캐싱)
  - 게시물 조회수 (실시간 반영 대신 10분마다 DB 업데이트)

#### Spring Cache 사용
```java
@Cacheable(value = "categories", unless = "#result == null")
public List<Category> getAllCategories() {
    return categoryRepository.findAll();
}

@CacheEvict(value = "categories", allEntries = true)
public Category createCategory(Category category) {
    return categoryRepository.save(category);
}
```

---

### 8.3 페이징 처리

#### 큰 데이터셋 처리
- **Offset 기반 페이징**: 초기 구현 (간단)
- **Cursor 기반 페이징**: 추후 고려 (대량 데이터 시 성능 우수)

#### 예시
```java
@GetMapping("/api/articles")
public Page<ArticleDto> getArticles(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size,
    @RequestParam(defaultValue = "publishedAt,desc") String sort
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sort));
    return articleService.getArticles(pageable);
}
```

---

### 8.4 파일 서빙 최적화

#### Static 파일 처리
- **개발 환경**: Spring Boot가 `/uploads` 디렉토리 직접 서빙
- **운영 환경**: Nginx 등 웹 서버에서 정적 파일 처리 (Spring Boot 부하 감소)

#### 이미지 최적화
- **썸네일 자동 생성**: 업로드 시 원본 + 썸네일(300x300) 저장
- **라이브러리**: Thumbnailator (Java)

```java
Thumbnails.of(originalFile)
    .size(300, 300)
    .outputFormat("jpg")
    .toFile(thumbnailFile);
```

---

### 8.5 API 응답 속도 최적화

#### DTO 프로젝션
- **문제**: 엔티티 전체를 반환하면 불필요한 데이터 전송
- **해결**: 필요한 필드만 포함한 DTO 사용

```java
public class ArticleListDto {
    private Long articleId;
    private String title;
    private String summary;
    private String thumbnailUrl;
    private int viewCount;
    // 필요한 필드만 포함
}
```

#### Lazy Loading 주의
- **기본 전략**: `@ManyToOne`, `@OneToOne` → EAGER
- **권장**: 명시적으로 `FetchType.LAZY` 설정 후 필요 시 FETCH

---

### 8.6 외부 API 호출 최적화 (Phase 3)

#### YouTube/Instagram API
- **Rate Limit**: API 호출 횟수 제한 존재
- **해결책**:
  - **배치 작업**: 매일 1회 새벽에 최신 콘텐츠 수집
  - **DB 캐싱**: 수집한 데이터를 `social_contents` 테이블에 저장
  - 사용자는 DB에서 조회 (API 직접 호출 최소화)

#### 스케줄러 구현
```java
@Scheduled(cron = "0 0 2 * * ?")  // 매일 새벽 2시
public void fetchYouTubeContents() {
    List<Video> videos = youtubeApiService.getLatestVideos();
    videos.forEach(video -> {
        if (!socialContentRepository.existsByExternalId(video.getId())) {
            socialContentRepository.save(convertToEntity(video));
        }
    });
}
```

---

## 9. 에러 처리 및 로깅

### 9.1 표준 에러 응답 형식

```json
{
  "timestamp": "2024-01-08T10:30:00",
  "status": 400,
  "error": "BAD_REQUEST",
  "message": "유효하지 않은 요청입니다.",
  "path": "/api/articles"
}
```

### 9.2 주요 에러 코드

| HTTP 상태 | 에러 코드 | 설명 |
|----------|---------|-----|
| 400 | INVALID_REQUEST | 잘못된 요청 (필수 파라미터 누락 등) |
| 401 | UNAUTHORIZED | 인증 실패 (토큰 없음/만료) |
| 403 | ACCESS_DENIED | 권한 없음 (관리자 전용 API) |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT | 중복 데이터 (이미 참여한 이벤트 등) |
| 500 | INTERNAL_SERVER_ERROR | 서버 오류 |

---

## 10. 개발 환경 설정

### 10.1 Docker Compose (PostgreSQL)

**docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: sabo-postgres
    environment:
      POSTGRES_DB: sabo_system
      POSTGRES_USER: sabo_user
      POSTGRES_PASSWORD: sabo_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - sabo-network

volumes:
  postgres_data:

networks:
  sabo-network:
    driver: bridge
```

**실행 명령어:**
```bash
docker-compose up -d
```

---

### 10.2 build.gradle (Spring Boot)

```gradle
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.1'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.koreazinc'
version = '1.0.0'
sourceCompatibility = '17'

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Starters
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    implementation 'org.springframework.boot:spring-boot-starter-security'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springframework.boot:spring-boot-starter-mail'
    
    // JWT
    implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.3'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.3'
    
    // PostgreSQL
    runtimeOnly 'org.postgresql:postgresql'
    
    // HTML Sanitization
    implementation 'com.googlecode.owasp-java-html-sanitizer:owasp-java-html-sanitizer:20220608.1'
    
    // Image Processing
    implementation 'net.coobird:thumbnailator:0.4.19'
    
    // External API (YouTube, Instagram)
    implementation 'com.google.api-client:google-api-client:2.2.0'
    implementation 'com.google.apis:google-api-services-youtube:v3-rev20231011-2.0.0'
    // Instagram Graph API는 REST 직접 호출 (공식 Java SDK 없음)
    
    // Swagger/OpenAPI
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0'
    
    // Lombok (선택사항, 코드 간소화)
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    
    // Testing
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.springframework.security:spring-security-test'
}

tasks.named('test') {
    useJUnitPlatform()
}
```

---

### 10.3 application.yml (Spring Boot)

```yaml
spring:
  application:
    name: sabo-system

  datasource:
    url: jdbc:postgresql://localhost:5432/sabo_system
    username: sabo_user
    password: sabo_password
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update  # 개발: update, 운영: validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.PostgreSQLDialect

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB

  mail:
    host: smtp.koreazinc.com  # 고려아연 내부 SMTP 서버 (추후 제공)
    port: 587
    username: newsletter@koreazinc.com
    password: ${SMTP_PASSWORD}  # 환경 변수로 관리
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
          connectiontimeout: 5000
          timeout: 5000
          writetimeout: 5000

jwt:
  secret: your-256-bit-secret-key-here-change-in-production
  access-token-validity: 3600  # 1시간 (초 단위)
  refresh-token-validity: 604800  # 7일 (초 단위)

file:
  upload-dir: /uploads

logging:
  level:
    com.koreazinc.sabosystem: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
```

---

### 10.3 Package.json (React)

```json
{
  "name": "sabo-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "@tinymce/tinymce-react": "^4.3.0",
    "tailwindcss": "^3.3.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "proxy": "http://localhost:8080"
}
```

---

## 11. 다음 단계 (개발 완료 후)

### 11.1 테스트
- **단위 테스트**: JUnit 5, Mockito
- **통합 테스트**: TestContainers (PostgreSQL)
- **E2E 테스트**: Selenium 또는 Playwright (선택)

### 11.2 배포
- **Docker 이미지 빌드**: Spring Boot + React 통합
- **환경 변수 관리**: `.env` 파일 또는 Docker Secrets

### 11.3 모니터링
- **애플리케이션 로그**: Logback
- **에러 추적**: Sentry (선택)
- **성능 모니터링**: Spring Boot Actuator + Prometheus (Phase 3)

---

## 12. 부록: 기술 의사결정 근거

### 12.1 왜 Spring Boot인가?
- **생태계 성숙도**: 엔터프라이즈급 애플리케이션에 검증됨
- **JPA 지원**: ORM을 통한 생산성 향상
- **Spring Security**: 강력한 인증/권한 관리

### 12.2 왜 React인가?
- **컴포넌트 기반**: 재사용성 높음
- **생태계**: 풍부한 라이브러리 (에디터, UI 등)
- **성능**: Virtual DOM으로 빠른 렌더링

### 12.3 왜 PostgreSQL인가?
- **JSON 지원**: 향후 확장 가능성 (해시태그 등을 JSON으로 저장 가능)
- **성능**: 대용량 데이터 처리 우수
- **오픈소스**: 라이선스 비용 없음

---

## 13. 개발 시 주의사항

### 13.1 HTML 에디터 선택
- **TinyMCE vs CKEditor**:
  - TinyMCE: 무료 버전 기능 풍부, 클라우드 버전 사용 시 가입 필요
  - CKEditor: 오픈소스 버전 안정적, 플러그인 생태계 우수
- **권장**: TinyMCE (HTML 모드 지원 확실, React 통합 쉬움)

### 13.2 이미지 경로 관리
- **절대 경로 vs 상대 경로**:
  - DB 저장: `/uploads/articles/2024/01/image.jpg` (상대 경로)
  - 프론트엔드: `http://localhost:8080/uploads/...` (API 서버 기준)
- **운영 시**: CDN 도메인으로 교체 가능하도록 설계

### 13.3 타임존 처리
- **서버**: UTC 기준으로 저장
- **클라이언트**: 사용자의 로컬 타임존으로 표시
- **Java**: `ZonedDateTime` 또는 `OffsetDateTime` 사용

---

## 14. 마일스톤 및 일정

**실제 작업 진행 상황은 `plan.md`에서 관리합니다.**

| Phase | 기간 | 주요 기능 | 완료 기준 |
|-------|-----|---------|----------|
| Phase 1 | 2-3주 | 로그인, 사보 CRUD, 관리자 기능, 파일 업로드 | 게시물 작성/조회 가능, 기본 UI 완성 |
| Phase 2 | 2-3주 | 해시태그, 반응, 별점, 이벤트, 팝업, 배너 | 임직원 참여 기능 작동, 이벤트 참여/추첨 가능 |
| Phase 3 | 3-4주 | 소셜 연동, 뉴스레터, 대시보드 | 전체 기능 통합 완료, 외부 콘텐츠 자동 수집 |

### 진행 추적
- **일일 진행 상황**: `plan.md`의 체크박스로 확인
- **이슈 관리**: `plan.md`의 "발견된 이슈" 섹션
- **전체 진행률**: `plan.md` 상단 테이블

---

## 15. 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|-----|------|---------|-------|
| 1.0 | 2024-01-08 | 초안 작성 | Claude |

---

**문서 종료**

이 문서는 개발 진행 상황에 따라 지속적으로 업데이트됩니다.
