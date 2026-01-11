# Railway 환경 변수 설정 가이드

## 🔑 생성된 JWT_SECRET
```
97e747f1d21b8f8c3d7bd75bd5b3eaec022163fff3d41fde2f5de7f0a8e5d95c
```

## 📝 웹 대시보드에서 환경 변수 설정 방법

### 1. Railway 프로젝트 대시보드 접속
https://railway.com/project/b2e286b9-1447-43d0-8aea-dda5894b634b

### 2. 서비스 선택
- "korea-zinc-magazine" 프로젝트 내의 서비스 클릭
- PostgreSQL이 아닌 **Backend 서비스** 선택
- (아직 Backend 서비스가 없다면, 먼저 배포 후 설정)

### 3. Variables 탭 이동
- 서비스 페이지 상단의 **"Variables"** 탭 클릭

### 4. 환경 변수 추가
다음 변수들을 추가하세요:

#### 필수 변수:

**JWT_SECRET**
```
97e747f1d21b8f8c3d7bd75bd5b3eaec022163fff3d41fde2f5de7f0a8e5d95c
```

**MOCK_ENABLED**
```
false
```

#### 자동 생성된 변수 (확인만):
- `DATABASE_URL`: PostgreSQL 추가 시 자동 생성됨 ✅

#### 선택 변수 (필요시):
**SPRING_PROFILES_ACTIVE**
```
prod
```

### 5. 변수 추가 방법
1. "+ New Variable" 버튼 클릭
2. Variable Name: `JWT_SECRET`
3. Variable Value: `97e747f1d21b8f8c3d7bd75bd5b3eaec022163fff3d41fde2f5de7f0a8e5d95c`
4. "Add" 버튼 클릭
5. `MOCK_ENABLED`도 동일하게 반복

---

## ✅ 설정 완료 후

모든 환경 변수가 추가되면:
1. 자동으로 재배포될 수 있음
2. 또는 수동으로 재배포: "Deploy" 버튼 클릭

---

**작성 시간**: 2026-01-11 20:18
