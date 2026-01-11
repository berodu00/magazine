
INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_by, created_at)
VALUES ('Phase 2 Test Banner', '/uploads/seed/banner_test.png', 'http://google.com', 1, true, (SELECT user_id FROM users WHERE email='admin@koreazinc.com'), NOW());

INSERT INTO popups (title, popup_type, content, start_date, end_date, is_active, created_by, created_at)
VALUES ('Phase 2 Text Popup', 'TEXT', '<div class="p-4 text-center"><h1>Welcome to Phase 2</h1><p>Enjoy the new features!</p></div>', NOW(), NOW() + INTERVAL '1 day', true, (SELECT user_id FROM users WHERE email='admin@koreazinc.com'), NOW());

INSERT INTO popups (title, popup_type, image_url, start_date, end_date, is_active, created_by, created_at)
VALUES ('Phase 2 Image Popup', 'IMAGE', '/uploads/seed/popup_test.png', NOW(), NOW() + INTERVAL '1 day', true, (SELECT user_id FROM users WHERE email='admin@koreazinc.com'), NOW());

INSERT INTO events (title, content, start_date, end_date, is_active, winner_count, created_by, created_at)
VALUES ('Phase 2 Test Event', '<p>Join our special event!</p>', NOW(), NOW() + INTERVAL '7 days', true, 1, (SELECT user_id FROM users WHERE email='admin@koreazinc.com'), NOW());
