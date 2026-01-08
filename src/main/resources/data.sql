-- 1. 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO users (email, password, name, department, role) VALUES
('admin@koreazinc.com', '$2b$12$YWfQX8G/wZJaYPCbKcTcWOpCLfblZpqW7fdxEYjUxDgC4H5FAhDie', '관리자', '커뮤니케이션팀', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET password = excluded.password;

-- 2. 테스트용 일반 사용자 (비밀번호: user123)
INSERT INTO users (email, password, name, department, role) VALUES
('user1@koreazinc.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AzHuEVZW8Yxp6G', '홍길동', '생산부', 'USER'),
('user2@koreazinc.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG13AzHuEVZW8Yxp6G', '김철수', '인사팀', 'USER')
ON CONFLICT (email) DO UPDATE SET password = excluded.password;

-- 3. 기본 카테고리 생성
INSERT INTO categories (name, display_order) VALUES
('Special', 1),
('People', 2),
('Life', 3)
ON CONFLICT (name) DO NOTHING;

-- 4. 테스트용 해시태그
INSERT INTO hashtags (tag_name, usage_count) VALUES
('안전', 5),
('성과', 8),
('채용', 3),
('환경', 4)
ON CONFLICT (tag_name) DO NOTHING;
