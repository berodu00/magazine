-- Mock Banner Data Seeding for Korea Zinc Magazine
-- Prefixed with [TEST] for identification

INSERT INTO banners (title, image_url, link_url, display_order, is_active, created_by, created_at, updated_at)
VALUES 
('[TEST] Global No.1 Smelter: Onsan Plant', '/uploads/koreazinc_smelter_exterior_1768096488377.png', '/articles', 1, true, 1, NOW(), NOW()),
('[TEST] 2026 Sustainability Report', '/uploads/koreazinc_esg_green_1768096520819.png', '/social', 2, true, 1, NOW(), NOW()),
('[TEST] Smart Work at Korea Zinc', '/uploads/koreazinc_office_interior_1768096505917.png', '/articles', 3, true, 1, NOW(), NOW()),
('[TEST] Safety First Campaign', '/uploads/koreazinc_safety_first_1768096535414.png', '/events', 4, true, 1, NOW(), NOW());
