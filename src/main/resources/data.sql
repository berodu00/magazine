-- 0. 기존 데이터 초기화 (인코딩 문제 해결을 위한 초기화)
TRUNCATE TABLE article_hashtags, articles, hashtags, categories, users, reactions, ratings, events, event_participants, popups, banners, social_contents, ideas, newsletters, newsletter_articles CASCADE;

-- 1. 관리자 및 사용자 계정 생성
INSERT INTO users (email, password, name, department, role) VALUES
('admin@koreazinc.com', '$2b$12$7eWU7XUnVxvU5V/ebwfw1e0/qncVRgmMDMAR0glA/RDQGFOGXhYOq', '관리자', '커뮤니케이션팀', 'ADMIN'),
('user1@koreazinc.com', '$2b$12$BfV8YfD4jbIRcgGvO4gD.e7J2UyMLKe3izS4oTMHBFGLhTURqSqHC', '홍길동', '생산부', 'USER'),
('user2@koreazinc.com', '$2b$12$BfV8YfD4jbIRcgGvO4gD.e7J2UyMLKe3izS4oTMHBFGLhTURqSqHC', '김철수', '인사팀', 'USER')
ON CONFLICT (email) DO UPDATE SET password = excluded.password;

-- 2. 카테고리 생성
INSERT INTO categories (name, display_order) VALUES
('Special', 1),
('People', 2),
('Life', 3),
('ESG', 4),
('Innovation', 5)
ON CONFLICT (name) DO NOTHING;

-- 3. 해시태그 생성 (초기값)
INSERT INTO hashtags (tag_name, usage_count) VALUES
('ESG', 10),
('지속가능성', 8),
('혁신', 5),
('스마트팩토리', 3),
('조직문화', 7),
('안전', 12),
('함께해요', 4),
('고려아연', 15)
ON CONFLICT (tag_name) DO UPDATE SET usage_count = excluded.usage_count;

-- 4. 게시물 데이터 (Rich Content)
-- 4.1 ESG 관련 기사
INSERT INTO articles (title, content, summary, thumbnail_url, view_count, is_published, published_at, category_id, author_id)
SELECT '지속가능한 미래를 위한 고려아연의 약속',
       '<p>고려아연은 지속 가능한 미래를 위해 <strong>RE100 달성</strong>과 <strong>탄소 중립</strong>을 향해 나아가고 있습니다.</p><p>최근 도입된 태양광 발전 시스템과 스마트 에너지 관리 솔루션은 공장의 에너지 효율을 극대화하고 있습니다.</p><h3>주요 성과</h3><ul><li>연간 탄소 배출량 15% 감축</li><li>폐열 회수 시스템 고도화</li><li>지역 사회 숲 조성 프로젝트 참여</li></ul><p>우리의 이러한 노력은 단순한 환경 보호를 넘어, 미래 세대에게 더 나은 환경을 물려주기 위한 약속입니다.</p>',
       '탄소 중립과 신재생 에너지 도입을 통한 고려아연의 ESG 경영 성과를 소개합니다.',
       '/uploads/seed/esg.png',
       1250,
       true,
       NOW() - INTERVAL '2 days',
       c.category_id,
       u.user_id
FROM categories c, users u
WHERE c.name = 'ESG' AND u.email = 'admin@koreazinc.com'
  AND NOT EXISTS (SELECT 1 FROM articles WHERE title = '지속가능한 미래를 위한 고려아연의 약속');

-- 4.2 혁신 기술 기사
INSERT INTO articles (title, content, summary, thumbnail_url, view_count, is_published, published_at, category_id, author_id)
SELECT '스마트 제련소: 제련의 미래를 그리다',
       '<p>디지털 전환(DX)은 선택이 아닌 필수입니다. 최첨단 <strong>스마트 제련 공정</strong> 도입으로 생산성과 안전성을 동시에 확보했습니다.</p><p><img src="/uploads/seed/smelting.png" alt="Smart Smelting" style="width:100%; border-radius: 8px;"/></p><h3>AI 기반 품질 관리</h3><p>인공지능 비전 검사 시스템을 통해 제품의 결함을 실시간으로 탐지하고, 빅데이터 분석으로 공정 최적화 모델을 수립했습니다.</p>',
       'AI와 빅데이터를 활용한 스마트 제련 공정 도입으로 생산 혁신을 이뤄낸 현장을 취재했습니다.',
       '/uploads/seed/smelting.png',
       890,
       true,
       NOW() - INTERVAL '5 days',
       c.category_id,
       u.user_id
FROM categories c, users u
WHERE c.name = 'Innovation' AND u.email = 'admin@koreazinc.com'
  AND NOT EXISTS (SELECT 1 FROM articles WHERE title = '스마트 제련소: 제련의 미래를 그리다');

-- 4.3 조직문화 기사
INSERT INTO articles (title, content, summary, thumbnail_url, view_count, is_published, published_at, category_id, author_id)
SELECT '우리가 만드는 즐거운 소통 문화',
       '<p>수평적인 소통과 자율적인 업무 환경, 고려아연 피플들의 이야기입니다.</p><p>최근 진행된 <strong>타운홀 미팅</strong>에서는 직급을 떠나 자유롭게 의견을 나누는 시간이 마련되었습니다.</p><blockquote>"서로의 다름을 인정하고 존중할 때 진정한 시너지가 발휘됩니다."</blockquote><p>매주 금요일 진행되는 캐주얼 데이와 멘토링 프로그램도 직원들의 큰 호응을 얻고 있습니다.</p>',
       '수평적이고 자율적인 조직 문화를 만들어가는 임직원들의 생생한 목소리를 담았습니다.',
       '/uploads/seed/meeting.png',
       2100,
       true,
       NOW() - INTERVAL '12 hours',
       c.category_id,
       u.user_id
FROM categories c, users u
WHERE c.name = 'People' AND u.email = 'admin@koreazinc.com'
  AND NOT EXISTS (SELECT 1 FROM articles WHERE title = '우리가 만드는 즐거운 소통 문화');

-- 5. 게시물-해시태그 매핑
-- 5.1 ESG 기사 해시태그 매핑
INSERT INTO article_hashtags (article_id, hashtag_id)
SELECT a.article_id, h.hashtag_id
FROM articles a, hashtags h
WHERE a.title = '지속가능한 미래를 위한 고려아연의 약속' AND h.tag_name IN ('ESG', '지속가능성', '환경', '고려아연')
ON CONFLICT DO NOTHING;

-- 5.2 혁신 기사 해시태그 매핑
INSERT INTO article_hashtags (article_id, hashtag_id)
SELECT a.article_id, h.hashtag_id
FROM articles a, hashtags h
WHERE a.title = '스마트 제련소: 제련의 미래를 그리다' AND h.tag_name IN ('혁신', '스마트팩토리', '안전', '고려아연')
ON CONFLICT DO NOTHING;

-- 5.3 조직문화 기사 해시태그 매핑
INSERT INTO article_hashtags (article_id, hashtag_id)
SELECT a.article_id, h.hashtag_id
FROM articles a, hashtags h
WHERE a.title = '우리가 만드는 즐거운 소통 문화' AND h.tag_name IN ('조직문화', '함께해요', '고려아연')
ON CONFLICT DO NOTHING;

-- 6. 배너 데이터 (Rolling Banner)
INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_at, created_by)
SELECT 'Global No.1 Smelter: Onsan Plant', '/uploads/koreazinc_smelter_exterior_1768096488377.png', '/articles', 1, true, NOW(), u.user_id
FROM users u WHERE u.email = 'admin@koreazinc.com'
AND NOT EXISTS (SELECT 1 FROM banners WHERE title = 'Global No.1 Smelter: Onsan Plant');

INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_at, created_by)
SELECT '2026 Sustainability Report', '/uploads/koreazinc_esg_green_1768096520819.png', '/social', 2, true, NOW(), u.user_id
FROM users u WHERE u.email = 'admin@koreazinc.com'
AND NOT EXISTS (SELECT 1 FROM banners WHERE title = '2026 Sustainability Report');

INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_at, created_by)
SELECT 'Smart Work at Korea Zinc', '/uploads/koreazinc_office_interior_1768096505917.png', '/articles', 3, true, NOW(), u.user_id
FROM users u WHERE u.email = 'admin@koreazinc.com'
AND NOT EXISTS (SELECT 1 FROM banners WHERE title = 'Smart Work at Korea Zinc');

INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_at, created_by)
SELECT 'Safety First Campaign', '/uploads/koreazinc_safety_first_1768096535414.png', '/events', 4, true, NOW(), u.user_id
FROM users u WHERE u.email = 'admin@koreazinc.com'
AND NOT EXISTS (SELECT 1 FROM banners WHERE title = 'Safety First Campaign');

-- 7. 이벤트 데이터
INSERT INTO events (title, content, thumbnail_url, start_date, end_date, location, is_active, created_at, created_by)
SELECT '2026년 새해 소망 댓글 이벤트', '임직원 여러분의 2026년 이루고 싶은 소망을 댓글로 남겨주세요! 추첨을 통해 선물을 드립니다.', '/uploads/koreazinc_esg_green_1768096520819.png', NOW(), NOW() + INTERVAL '14 days', '온라인 댓글', true, NOW(), u.user_id
FROM users u WHERE u.email = 'admin@koreazinc.com'
AND NOT EXISTS (SELECT 1 FROM events WHERE title = '2026년 새해 소망 댓글 이벤트');

INSERT INTO events (title, content, thumbnail_url, start_date, end_date, location, is_active, created_at, created_by)
SELECT '우리 팀 자랑하기 사진 공모전', '활기찬 우리 팀의 모습을 사진으로 자랑해주세요. 베스트 팀에게는 회식비 지원!', '/uploads/koreazinc_office_interior_1768096505917.png', NOW(), NOW() + INTERVAL '30 days', '사내 게시판', true, NOW(), u.user_id
FROM users u WHERE u.email = 'admin@koreazinc.com'
AND NOT EXISTS (SELECT 1 FROM events WHERE title = '우리 팀 자랑하기 사진 공모전');

-- 8. 소셜 콘텐츠 데이터 (Mock Data)
INSERT INTO social_contents (platform, external_id, title, description, thumbnail_url, link_url, published_at, fetched_at) VALUES
('YOUTUBE', 'vid_001', 'Korea Zinc Sustainability Report 2025', 'Highlighting our ESG achievements for the year.', '/uploads/koreazinc_esg_green_1768096520819.png', 'https://youtube.com/watch?v=mock1', NOW() - INTERVAL '3 days', NOW()),
('YOUTUBE', 'vid_002', 'Onsan Plant Safety Drill', 'Ensuring the highest safety standards at our production sites.', '/uploads/koreazinc_safety_first_1768096535414.png', 'https://youtube.com/watch?v=mock2', NOW() - INTERVAL '5 days', NOW()),
('YOUTUBE', 'vid_003', 'Innovation in Smelting Technology', 'Exploring the future of non-ferrous metal production.', '/uploads/koreazinc_smelter_exterior_1768096488377.png', 'https://youtube.com/watch?v=mock3', NOW() - INTERVAL '1 week', NOW()),
('INSTAGRAM', 'inst_001', 'Employee Spotlight: Team Innovation', '#KoreaZinc #Innovation #Teamwork', '/uploads/koreazinc_office_interior_1768096505917.png', 'https://instagram.com/p/mock1', NOW() - INTERVAL '1 day', NOW()),
('INSTAGRAM', 'inst_002', 'Green Energy Initiatives', '#ESG #GreenEnergy #Sustainability', '/uploads/koreazinc_esg_green_1768096520819.png', 'https://instagram.com/p/mock2', NOW() - INTERVAL '2 days', NOW()),
('INSTAGRAM', 'inst_003', 'Join us at the Global Metals Forum', '#MetalsForum #IndustryLeader', '/uploads/koreazinc_smelter_exterior_1768096488377.png', 'https://instagram.com/p/mock3', NOW() - INTERVAL '4 days', NOW()),
('INSTAGRAM', 'inst_004', 'Safety First, Always.', '#SafetyFirst #OnsanPlant', '/uploads/koreazinc_safety_first_1768096535414.png', 'https://instagram.com/p/mock4', NOW() - INTERVAL '6 days', NOW())
ON CONFLICT (platform, external_id) DO NOTHING;
