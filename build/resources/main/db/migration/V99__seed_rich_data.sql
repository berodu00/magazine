-- Mock Data Seeding for Korea Zinc Magazine
-- All mock data prefixed with [TEST] for easy identification/deletion

-- 1. Social Contents (YouTube)
INSERT INTO social_contents (platform, external_id, title, description, thumbnail_url, link_url, published_at, fetched_at)
VALUES 
('YOUTUBE', 'mock_yt_1', '[TEST] 고려아연 온산제련소: 혁신의 현장', '세계 최고의 아연 제련 기술을 보유한 온산제련소의 24시간을 담았습니다. 스마트 팩토리로 거듭나는 제련소의 모습을 확인하세요.', '/uploads/koreazinc_smelter_exterior_1768096488377.png', 'https://www.youtube.com/watch?v=mock_1', NOW() - INTERVAL '1 DAY', NOW()),
('YOUTUBE', 'mock_yt_2', '[TEST] 2026 지속가능경영보고서 발간', '고려아연의 ESG 경영 성과와 미래 비전을 담은 2026 지속가능경영보고서가 발간되었습니다. 주주와 고객, 직원 모두를 위한 가치 창출을 약속합니다.', '/uploads/koreazinc_esg_green_1768096520819.png', 'https://www.youtube.com/watch?v=mock_2', NOW() - INTERVAL '3 DAY', NOW()),
('YOUTUBE', 'mock_yt_3', '[TEST] CEO 메세지: 도전을 향한 여정', '창립 52주년을 맞아 CEO가 전하는 고려아연의 새로운 도전과 비전. 신재생 에너지 사업으로의 확장을 이야기합니다.', '/uploads/koreazinc_office_interior_1768096505917.png', 'https://www.youtube.com/watch?v=mock_3', NOW() - INTERVAL '5 DAY', NOW()),
('YOUTUBE', 'mock_yt_4', '[TEST] 안전이 최우선입니다: Safety First 캠페인', '모든 임직원의 안전한 귀가를 위한 Safety First 캠페인 현장 스케치. 무재해 사업장을 위한 우리의 약속.', '/uploads/koreazinc_safety_first_1768096535414.png', 'https://www.youtube.com/watch?v=mock_4', NOW() - INTERVAL '7 DAY', NOW()),
('YOUTUBE', 'mock_yt_5', '[TEST] KZ Family Day: 2025 가족 초청 행사', '임직원 가족과 함께한 뜻깊은 시간! 웃음과 감동이 가득했던 패밀리 데이 하이라이트 영상입니다.', '/uploads/koreazinc_office_interior_1768096505917.png', 'https://www.youtube.com/watch?v=mock_5', NOW() - INTERVAL '10 DAY', NOW());

-- 2. Social Contents (Instagram)
INSERT INTO social_contents (platform, external_id, title, description, thumbnail_url, link_url, published_at, fetched_at)
VALUES
('INSTAGRAM', 'mock_ig_1', '[TEST] #고려아연 #ESG #푸른하늘', '오늘 온산 하늘은 맑음! ☀️ 친환경 공정을 통해 깨끗한 환경을 만들어갑니다.\n#Zinc #EcoFriendly', '/uploads/koreazinc_esg_green_1768096520819.png', 'https://www.instagram.com/p/mock_1', NOW() - INTERVAL '2 HOUR', NOW()),
('INSTAGRAM', 'mock_ig_2', '[TEST] #SafetyFirst #안전점검', '매일 아침 시작되는 안전 점검 미팅. 오늘도 안전하세요! 👷‍♂️👷‍♀️\n#WorkSafety #Teamwork', '/uploads/koreazinc_safety_first_1768096535414.png', 'https://www.instagram.com/p/mock_2', NOW() - INTERVAL '5 HOUR', NOW()),
('INSTAGRAM', 'mock_ig_3', '[TEST] #스마트팩토리 #혁신', '데이터로 일하는 스마트 제련소. 태블릿 하나로 공정 현황을 한눈에! 📱\n#Innovation #SmartFactory', '/uploads/koreazinc_smelter_exterior_1768096488377.png', 'https://www.instagram.com/p/mock_3', NOW() - INTERVAL '1 DAY', NOW()),
('INSTAGRAM', 'mock_ig_4', '[TEST] #점심시간 #구내식당', '오늘의 특식은 전복 삼계탕! 🍲 힘내서 오후 업무도 화이팅!\n#Lunch #KZLife', '/uploads/koreazinc_office_interior_1768096505917.png', 'https://www.instagram.com/p/mock_4', NOW() - INTERVAL '2 DAY', NOW());

-- 3. Social Contents (Homepage Press)
INSERT INTO social_contents (platform, external_id, title, description, thumbnail_url, link_url, published_at, fetched_at)
VALUES
('HOMEPAGE', 'mock_pr_1', '[TEST] 고려아연, 호주 신재생 에너지 기업 인수', '고려아연이 호주의 풍력 발전 기업을 인수하며 그린 수소 밸류체인 확장에 박차를 가하고 있다.', NULL, 'https://www.koreazinc.co.kr/pr/1', NOW() - INTERVAL '12 HOUR', NOW()),
('HOMEPAGE', 'mock_pr_2', '[TEST] 온산제련소, 탄소중립 로드맵 발표', '2050 탄소중립 달성을 위한 구체적인 로드맵을 발표하고, 친환경 설비 투자를 대폭 확대한다.', NULL, 'https://www.koreazinc.co.kr/pr/2', NOW() - INTERVAL '2 DAY', NOW());


-- 4. Events (Active & Closed)
INSERT INTO events (title, content, thumbnail_url, start_date, end_date, is_active, winner_count, winners_announced, created_by, created_at, updated_at)
VALUES
('[TEST] 2026 신년 맞이 소망 댓글 이벤트', '<p>여러분의 2026년 새해 소망은 무엇인가요? 댓글로 남겨주시면 추첨을 통해 선물을 드립니다!</p>', '/uploads/koreazinc_esg_green_1768096520819.png', NOW(), NOW() + INTERVAL '14 DAY', true, 10, false, 1, NOW(), NOW()),
('[TEST] 우리 팀 자랑하기: 오피스 라이프 사진 공모전', '<p>즐거운 우리 팀의 일상을 공유해주세요. 베스트 포토제닉 팀에게 회식비를 쏩니다!</p>', '/uploads/koreazinc_office_interior_1768096505917.png', NOW(), NOW() + INTERVAL '30 DAY', true, 3, false, 1, NOW(), NOW()),
('[TEST] 안전 슬로건 공모전', '<p>안전한 사업장을 만들기 위한 참신한 슬로건을 찾습니다.</p>', '/uploads/koreazinc_safety_first_1768096535414.png', NOW() - INTERVAL '30 DAY', NOW() - INTERVAL '1 DAY', false, 5, true, 1, NOW(), NOW());

-- Update Event Winners Announcement for Closed Event
UPDATE events 
SET winner_announcement = '<p>대상: 홍길동 (안전팀)<br>최우수상: 김철수 (제련1팀)<br>축하드립니다!</p>'
WHERE title = '[TEST] 안전 슬로건 공모전';
