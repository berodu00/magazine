# 안티그래비티 에이전트 설정 가이드

**프로젝트명:** 고려아연 전자사보 시스템  
**작성일:** 2026-01-08  
**버전:** 1.0  

---

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [프로젝트 구조 설정](#2-프로젝트-구조-설정)
3. [개발자 에이전트 설정](#3-개발자-에이전트-설정)
4. [검수자 에이전트 설정](#4-검수자-에이전트-설정)
5. [에이전트 협업 시작](#5-에이전트-협업-시작)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. 사전 준비

### 1.1 필요한 파일 확인

다음 5개 파일이 모두 준비되어 있어야 합니다:

```
📁 프로젝트 루트/
├── techspec.md              ✅ 기술 명세서
├── plan.md                  ✅ 작업 관리
├── ui_ux_guide.md          ✅ UI/UX 가이드
└── agents/
    ├── 03.developer.md         ✅ 개발자 에이전트 지시서
    └── 04.reviewer.md          ✅ 검수자 에이전트 지시서
```

### 1.2 안티그래비티 프로젝트 생성

1. **안티그래비티 실행**
2. **New Project** 클릭
3. 프로젝트명: `kz-sabo-system` (또는 원하는 이름)
4. 위치: 원하는 로컬 디렉토리 선택

---

## 2. 프로젝트 구조 설정

### 2.1 문서 파일 배치

안티그래비티 프로젝트 루트에 다음과 같이 파일을 배치합니다:

```bash
# 프로젝트 루트 디렉토리에서 실행
mkdir -p docs agents

# 문서 복사
cp /path/to/techspec.md docs/
cp /path/to/plan.md docs/
cp /path/to/ui_ux_guide.md docs/

# 에이전트 지시서 복사
cp /path/to/agents/03.developer.md agents/
cp /path/to/agents/04.reviewer.md agents/
```

**최종 구조:**
```
📁 kz-sabo-system/
├── docs/
│   ├── techspec.md
│   ├── plan.md
│   └── ui_ux_guide.md
├── agents/
│   ├── 03.developer.md
│   └── 04.reviewer.md
├── backend/              (개발 시작 후 생성)
└── frontend/             (개발 시작 후 생성)
```

### 2.2 .antigravity 폴더 설정 (선택사항)

프로젝트 규칙을 정의하고 싶다면:

```bash
mkdir -p .antigravity
```

`.antigravity/rules.md` 생성:
```markdown
# 프로젝트 규칙

## 필수 준수 문서
모든 에이전트는 다음 문서를 **헌법처럼** 준수해야 합니다:
- docs/techspec.md
- docs/plan.md
- docs/ui_ux_guide.md

## 작업 원칙
1. plan.md의 순서대로 작업
2. techspec.md 위반 절대 금지
3. 자체 테스트 필수
4. 검수자의 피드백 즉시 반영
```

---

## 3. 개발자 에이전트 설정

### 3.1 에이전트 생성

1. **안티그래비티 좌측 사이드바** → **Agents** 클릭
2. **New Agent** 클릭
3. 다음 정보 입력:

#### 기본 정보
```
Name: Developer
Description: Spring Boot + React 풀스택 개발자
```

### 3.2 시스템 프롬프트 설정

**System Prompt**란에 다음을 입력:

```markdown
당신은 고려아연 전자사보 시스템을 구축하는 숙련된 풀스택 개발자입니다.

## 역할
- Spring Boot (Backend)와 React (Frontend) 개발
- plan.md의 작업 항목을 순차적으로 구현
- 자체 테스트 후 검수자에게 완료 알림

## 필수 준수 문서
1. **techspec.md**: API, DB, 보안, 성능 명세
2. **plan.md**: 작업 순서 및 체크리스트
3. **ui_ux_guide.md**: 디자인 시스템

## 작업 프로세스
1. plan.md에서 다음 작업 확인
2. techspec.md 명세 참조
3. 코드 작성 (네이밍 규칙, 주석)
4. 자체 테스트 (컴파일, 실행, API 호출)
5. 검수 요청

## 출력 형식
작업 완료 시 다음 형식으로 보고:
```
[작업 완료 알림]
작업 번호: X.X.X
작업 내용: ...
완료 파일: ...
자체 테스트: ✅ 통과
검수 요청: ...
```

## 중요 규칙
- techspec.md 위반 절대 금지
- 한 번에 하나의 작업만
- 테스트 없이 검수 요청 금지
- 검수자의 피드백 즉시 반영

상세 지침은 agents/03.developer.md를 참조하세요.
```

### 3.3 Context 파일 추가

**Context Files** 섹션에서 다음 파일 추가:

1. **Add File** 클릭
2. 다음 파일들을 선택:
   - ✅ `docs/techspec.md`
   - ✅ `docs/plan.md`
   - ✅ `docs/ui_ux_guide.md`
   - ✅ `agents/03.developer.md`

**Context Mode**: `Always Include` (항상 포함)

### 3.4 Model 설정

**Model** 선택:
- **추천**: Claude Sonnet 4 (최신)
- **대안**: Claude Opus 4.1 (더 강력하지만 느림)

### 3.5 Tools 설정 (선택사항)

필요한 도구 활성화:
- ✅ **File Operations**: 파일 생성/수정
- ✅ **Terminal**: 명령어 실행
- ✅ **Browser**: 문서 검색 (선택사항)

### 3.6 저장

**Save Agent** 클릭

---

## 4. 검수자 에이전트 설정

### 4.1 에이전트 생성

1. **Agents** → **New Agent**
2. 정보 입력:

#### 기본 정보
```
Name: Reviewer
Description: 품질 보증 담당 시니어 개발자
```

### 4.2 시스템 프롬프트 설정

```markdown
당신은 고려아연 전자사보 시스템의 품질 보증 담당자이자 시니어 개발자입니다.

## 역할
- 개발자 에이전트가 완료한 작업을 엄격하게 테스트
- techspec.md 명세 준수 여부 검증
- 버그 발견 시 명확한 피드백 제공
- plan.md 업데이트 (체크박스, 진행률)

## 핵심 원칙
1. **객관성**: 명세서 기준으로만 판단
2. **엄격함**: 테스트 항목 하나라도 실패하면 불합격
3. **건설적 피드백**: 문제점 + 해결 방향 제시
4. **일관성**: 동일한 기준 적용

## 검수 프로세스
1. 개발자의 완료 알림 수신
2. plan.md 확인 사항 체크
3. techspec.md 명세와 비교
4. 테스트 수행 (Backend, Frontend, 통합)
5-A. 합격 → plan.md 체크박스 [x] 업데이트
5-B. 불합격 → plan.md 이슈 섹션에 등록

## 출력 형식
### 합격 시
```
[검수 완료 - 합격]
작업 번호: X.X.X
검수 결과: ✅ 합격
확인 내역: ...
plan.md 업데이트: 완료
다음 작업: ...
```

### 불합격 시
```
[검수 완료 - 불합격]
작업 번호: X.X.X
검수 결과: ❌ 불합격
발견된 이슈: Issue #N
문제점: ...
해결 방법: ...
```

## 중요 규칙
- 명세서와 100% 일치해야 합격
- 모든 확인 사항 체크
- plan.md 업데이트 필수
- 건설적이고 명확한 피드백

상세 지침은 agents/04.reviewer.md를 참조하세요.
```

### 4.3 Context 파일 추가

**Context Files**:
- ✅ `docs/techspec.md`
- ✅ `docs/plan.md`
- ✅ `docs/ui_ux_guide.md`
- ✅ `agents/04.reviewer.md`

**Context Mode**: `Always Include`

### 4.4 Model 설정

- **추천**: Claude Sonnet 4 (개발자와 동일)

### 4.5 저장

**Save Agent** 클릭

---

## 5. 에이전트 협업 시작

### 5.1 작업 흐름

```
1. Developer 에이전트 활성화
   ↓
2. "plan.md의 1.1.1번 작업을 시작하세요"
   ↓
3. Developer가 작업 수행
   ↓
4. Developer가 완료 알림
   ↓
5. Reviewer 에이전트 활성화
   ↓
6. "개발자가 완료한 1.1.1번 작업을 검수하세요"
   ↓
7. Reviewer가 테스트 수행
   ↓
8-A. 합격 → plan.md 업데이트 → 다음 작업
8-B. 불합격 → 이슈 등록 → Developer 수정
```

### 5.2 첫 작업 시작하기

#### Step 1: Developer 에이전트 선택
안티그래비티 채팅 창에서 **Developer** 에이전트 선택

#### Step 2: 첫 작업 지시
```
안녕하세요! 고려아연 전자사보 시스템 개발을 시작하겠습니다.

plan.md를 확인하고 Phase 1의 첫 번째 작업(1.1.1 Spring Boot 프로젝트 생성)을 시작해주세요.

작업 완료 후 다음을 제공해주세요:
1. 생성된 파일 목록
2. build.gradle 내용
3. 자체 테스트 결과
```

#### Step 3: Developer 작업 완료 대기
Developer가 다음을 수행:
- `plan.md` 읽기
- `techspec.md` 10.2절 (build.gradle) 참조
- Spring Boot 프로젝트 생성
- 의존성 추가
- 컴파일 테스트
- 완료 보고

#### Step 4: Reviewer 에이전트로 전환
채팅 창에서 **Reviewer** 에이전트 선택

#### Step 5: 검수 요청
```
개발자가 1.1.1번 작업(Spring Boot 프로젝트 생성)을 완료했습니다.

다음을 검수해주세요:
1. build.gradle에 모든 필수 의존성이 포함되어 있는지
2. techspec.md 10.2절의 명세와 일치하는지
3. 프로젝트가 컴파일되는지

검수 결과에 따라 plan.md를 업데이트해주세요.
```

#### Step 6: Reviewer 검수 수행
Reviewer가 다음을 수행:
- `build.gradle` 확인
- `techspec.md` 명세와 비교
- 의존성 누락 체크
- 합격/불합격 판정
- `plan.md` 업데이트

#### Step 7: 다음 작업으로 이동
- **합격 시**: Developer에게 다음 작업(1.1.2) 지시
- **불합격 시**: Developer에게 수정 요청

---

## 6. 트러블슈팅

### 6.1 에이전트가 문서를 읽지 못함

**문제**: "techspec.md를 찾을 수 없습니다"

**해결책**:
1. Context Files에 파일이 올바르게 추가되었는지 확인
2. 파일 경로가 프로젝트 루트 기준인지 확인
   - ✅ `docs/techspec.md`
   - ❌ `/absolute/path/techspec.md`
3. Context Mode가 "Always Include"인지 확인

### 6.2 에이전트가 plan.md를 업데이트하지 못함

**문제**: Reviewer가 체크박스를 변경하지 않음

**해결책**:
1. Reviewer에게 명시적으로 지시:
   ```
   plan.md 파일을 열어 1.1.1번 작업의 체크박스를 [ ]에서 [x]로 변경하고 저장해주세요.
   ```
2. File Operations 권한 확인
3. 수동으로 변경 후 다음 작업 진행 (임시 방편)

### 6.3 에이전트가 작업 순서를 건너뜀

**문제**: Developer가 1.1.3을 하기 전에 1.2.1을 시작

**해결책**:
1. 명시적으로 지시:
   ```
   plan.md의 순서를 반드시 따라주세요. 1.1.1 → 1.1.2 → 1.1.3 순서로 진행해야 합니다.
   ```
2. 시스템 프롬프트에 강조 추가:
   ```
   **절대적 규칙**: plan.md의 순서를 건너뛰지 마세요.
   ```

### 6.4 에이전트가 techspec.md를 위반함

**문제**: API 경로가 명세와 다름 (`/api/article` 대신 `/api/articles`)

**해결책**:
1. Reviewer가 즉시 불합격 처리하도록 시스템 프롬프트 강화
2. Developer에게 피드백:
   ```
   techspec.md 6장을 다시 확인해주세요. API 경로는 정확히 `/api/articles`여야 합니다.
   ```

### 6.5 두 에이전트가 서로 대화하지 않음

**문제**: 안티그래비티는 에이전트 간 직접 대화를 지원하지 않음

**해결책**:
1. **사용자가 중재자 역할** 수행
2. Developer 완료 → 사용자가 결과 확인 → Reviewer에게 전달
3. Reviewer 피드백 → 사용자가 확인 → Developer에게 전달

**작업 흐름 (현실적)**:
```
[Developer 채팅]
사용자: "1.1.1번 작업 시작"
Developer: "작업 완료 [build.gradle 내용]"

[Reviewer 채팅으로 전환]
사용자: "Developer가 1.1.1 완료. [build.gradle 내용] 검수 부탁"
Reviewer: "합격 ✅ plan.md 업데이트 완료"

[Developer 채팅으로 전환]
사용자: "1.1.1 합격. 다음 작업 1.1.2 시작"
```

### 6.6 파일이 너무 많아 Context가 초과됨

**문제**: Context 토큰 제한 초과

**해결책**:
1. **단계별 Context 추가**
   - Phase 1: `techspec.md` (4~6장만), `plan.md` (Phase 1만)
   - Phase 2: UI 관련 추가
   - Phase 3: 소셜 연동 추가
2. **요약본 제공**
   - `techspec_summary.md` 생성 (핵심만 요약)

---

## 7. 에이전트 협업 팁

### 7.1 효과적인 지시 방법

#### ✅ 좋은 지시
```
plan.md의 1.2.1번 작업(User Entity 및 Repository 생성)을 수행해주세요.

참고 문서:
- techspec.md 4.2.1절 (users 테이블 스키마)
- techspec.md 3.2절 (디렉토리 구조)

완료 후 다음을 제공:
1. 생성된 파일 경로
2. Entity 클래스 코드
3. 컴파일 테스트 결과
```

#### ❌ 나쁜 지시
```
유저 테이블 만들어줘
```

### 7.2 진행 상황 추적

**매일 작업 종료 시**:
1. `plan.md` 열어서 진행률 확인
2. 완료된 작업 수 / 전체 작업 수 계산
3. 이슈가 있다면 `plan.md` 하단 이슈 섹션 확인

**예시**:
```
Phase 1 진행률: 5/42 (12%)
오늘 완료: 1.1.1 ~ 1.1.5
발견된 이슈: 없음
내일 계획: 1.2.1 ~ 1.2.7 (인증 기능)
```

### 7.3 이슈 관리

**이슈 발생 시**:
1. Reviewer가 `plan.md` 하단 이슈 섹션에 등록
2. 이슈 번호 부여 (Issue #1, #2, ...)
3. Developer에게 명확히 전달:
   ```
   Issue #1이 등록되었습니다. plan.md 하단 이슈 섹션을 확인하고 수정해주세요.
   ```

---

## 8. 실전 예시 (Phase 1.1 완성)

### 8.1 작업 1.1.1 ~ 1.1.5 (프로젝트 초기 설정)

#### Developer에게 지시:
```
Phase 1.1 프로젝트 초기 설정을 시작합니다.

작업 1.1.1부터 1.1.5까지 순서대로 진행해주세요:
1.1.1 Spring Boot 프로젝트 생성
1.1.2 application.yml 설정
1.1.3 Docker Compose로 PostgreSQL 실행
1.1.4 데이터베이스 스키마 생성
1.1.5 초기 데이터 삽입

각 작업 완료 시마다 보고해주세요.
```

#### Developer 작업 (1.1.1):
```
[작업 완료 알림]
작업 번호: 1.1.1
작업 내용: Spring Boot 프로젝트 생성
완료 파일:
  - build.gradle
  - src/main/java/.../SaboSystemApplication.java
자체 테스트: ✅ 통과 (./gradlew build 성공)
검수 요청: 의존성 정상 추가 확인 필요
```

#### Reviewer에게 지시:
```
Developer가 1.1.1번 작업을 완료했습니다. 검수 부탁드립니다.

확인 사항:
- build.gradle에 techspec.md 10.2절의 모든 의존성 포함
- 프로젝트 컴파일 성공

검수 후 plan.md를 업데이트해주세요.
```

#### Reviewer 검수:
```
[검수 완료 - 합격]
작업 번호: 1.1.1
검수 결과: ✅ 합격

확인 내역:
  ✅ Spring Boot 3.2.1 포함
  ✅ Spring Data JPA 포함
  ✅ Spring Security 포함
  ✅ JWT 의존성 포함
  ✅ PostgreSQL 드라이버 포함
  ✅ 컴파일 성공 확인

plan.md 업데이트: 완료 (체크박스 [x], 진행률 1/42)
다음 작업: 1.1.2 application.yml 설정
```

---

## 9. 요약 체크리스트

### ✅ 에이전트 설정 완료 확인

#### Developer 에이전트
- [ ] 에이전트 생성 완료
- [ ] 시스템 프롬프트 입력
- [ ] Context Files 추가 (techspec, plan, ui_ux_guide, 03.developer.md)
- [ ] Model 선택 (Claude Sonnet 4)
- [ ] Tools 활성화 (File Operations, Terminal)

#### Reviewer 에이전트
- [ ] 에이전트 생성 완료
- [ ] 시스템 프롬프트 입력
- [ ] Context Files 추가 (techspec, plan, ui_ux_guide, 04.reviewer.md)
- [ ] Model 선택 (Claude Sonnet 4)
- [ ] Tools 활성화 (File Operations)

#### 프로젝트 준비
- [ ] 문서 파일 배치 (docs/, agents/)
- [ ] plan.md 최신 버전 확인
- [ ] techspec.md 명세 최종 검토

---

## 10. 다음 단계

에이전트 설정이 완료되었으면:

1. **첫 작업 시작**
   ```
   "plan.md의 1.1.1번 작업을 시작하세요"
   ```

2. **진행 상황 모니터링**
   - 매일 `plan.md` 체크박스 확인
   - 이슈 섹션 점검

3. **Phase 1 완료 목표**
   - 42개 작업 완료
   - 로그인 → 게시물 CRUD → 파일 업로드 전체 플로우 작동

**화이팅! 성공적인 개발을 응원합니다!** 🚀

---

**문서 종료**
