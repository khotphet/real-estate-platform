BEGIN;

-- 1. รูปภาพทรัพย์ (Listing Photos - 12 รูป สำหรับ 4 ทรัพย์)
INSERT INTO m2_listing.listing_photos (
  id, listing_id, original_key, public_key, width, height, bytes, sort_order, is_cover, status
) VALUES
  -- UD-00101 (LPN UD-Posri)
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'raw/lpn_cover.jpg', 'public/lpn_cover.webp', 1920, 1080, 145000, 1, true, 'ready'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'raw/lpn_pool.jpg', 'public/lpn_pool.webp', 1920, 1080, 138000, 2, false, 'ready'),
  ('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 'raw/lpn_bed.jpg', 'public/lpn_bed.webp', 1920, 1080, 122000, 3, false, 'ready'),

  -- UD-00102 (The Base Central)
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000002', 'raw/base_cover.jpg', 'public/base_cover.webp', 1920, 1080, 152000, 1, true, 'ready'),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000002', 'raw/base_living.jpg', 'public/base_living.webp', 1920, 1080, 131000, 2, false, 'ready'),
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000002', 'raw/base_gym.jpg', 'public/base_gym.webp', 1920, 1080, 140000, 3, false, 'ready'),

  -- UD-00103 (Supalai Bella)
  ('50000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000003', 'raw/supalai_cover.jpg', 'public/supalai_cover.webp', 1920, 1080, 168000, 1, true, 'ready'),
  ('50000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000003', 'raw/supalai_garden.jpg', 'public/supalai_garden.webp', 1920, 1080, 155000, 2, false, 'ready'),
  ('50000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000003', 'raw/supalai_kitchen.jpg', 'public/supalai_kitchen.webp', 1920, 1080, 129000, 3, false, 'ready'),

  -- UD-00104 (Land Chintakham)
  ('50000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000004', 'raw/land_front.jpg', 'public/land_front.webp', 1920, 1080, 185000, 1, true, 'ready'),
  ('50000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000004', 'raw/land_road.jpg', 'public/land_road.webp', 1920, 1080, 142000, 2, false, 'ready'),
  ('50000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000004', 'raw/land_survey.jpg', 'public/land_survey.webp', 1920, 1080, 110000, 3, false, 'ready')
ON CONFLICT (id) DO NOTHING;

-- 2. สิ่งอำนวยความสะดวกประจำทรัพย์ (Listing Amenities)
INSERT INTO m2_listing.listing_amenities (listing_id, amenity_code) VALUES
  ('30000000-0000-0000-0000-000000000001', 'pool'),
  ('30000000-0000-0000-0000-000000000001', 'gym'),
  ('30000000-0000-0000-0000-000000000001', 'security_24h'),
  ('30000000-0000-0000-0000-000000000001', 'parking'),

  ('30000000-0000-0000-0000-000000000002', 'pool'),
  ('30000000-0000-0000-0000-000000000002', 'gym'),
  ('30000000-0000-0000-0000-000000000002', 'near_mall'),
  ('30000000-0000-0000-0000-000000000002', 'security_24h'),

  ('30000000-0000-0000-0000-000000000003', 'parking'),
  ('30000000-0000-0000-0000-000000000003', 'security_24h')
ON CONFLICT DO NOTHING;

-- 3. ประวัติสถานะประกาศ (Listing Status History - Lifecycle Audit)
INSERT INTO m2_listing.listing_status_history (listing_id, from_status, to_status, reason, changed_by) VALUES
  ('30000000-0000-0000-0000-000000000001', 'draft', 'active', 'ตรวจผ่านและเผยแพร่ครั้งแรก', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000002', 'draft', 'active', 'นายหน้าโพสต์และอนุมัติทันที (Verified)', '10000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000003', 'draft', 'active', 'ตรวจผ่านและเผยแพร่', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000003', 'active', 'reserved', 'ผู้ซื้อวางเงินมัดจำทำสัญญาจะซื้อจะขาย', '10000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000004', 'draft', 'active', 'ส่งเข้า Agent Hub Exclusive เรียบร้อย', '10000000-0000-0000-0000-000000000001');

-- 4. สถิติรายวัน (Listing Daily Stats)
INSERT INTO m2_listing.listing_daily_stats (listing_id, day, views, favorites, chats, phone_reveals, shares) VALUES
  ('30000000-0000-0000-0000-000000000001', CURRENT_DATE - 2, 85, 4, 2, 1, 3),
  ('30000000-0000-0000-0000-000000000001', CURRENT_DATE - 1, 120, 7, 3, 2, 5),
  ('30000000-0000-0000-0000-000000000001', CURRENT_DATE, 45, 2, 1, 0, 1),
  ('30000000-0000-0000-0000-000000000002', CURRENT_DATE - 1, 62, 5, 4, 3, 2),
  ('30000000-0000-0000-0000-000000000002', CURRENT_DATE, 30, 2, 1, 1, 0)
ON CONFLICT (listing_id, day) DO NOTHING;

-- 5. รายการโปรด (Favorites)
INSERT INTO m3_discovery.favorites (user_id, listing_id, price_at_save, note) VALUES
  ('10000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 1450000, 'น่าสนใจ ใกล้ UD Town เดินทางสะดวก')
ON CONFLICT (user_id, listing_id) DO NOTHING;

-- 6. ผู้รอคิวทรัพย์ติดจอง (Waitlist Entries)
INSERT INTO m3_discovery.waitlist_entries (id, listing_id, user_id, status) VALUES
  ('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'waiting')
ON CONFLICT (id) DO NOTHING;

-- 7. ห้องแชทและข้อความ (Conversations & Messages)
INSERT INTO m4_engage.conversations (id, kind, listing_id, last_message_at) VALUES
  ('70000000-0000-0000-0000-000000000001', 'listing', '30000000-0000-0000-0000-000000000002', now() - interval '10 minutes')
ON CONFLICT (id) DO NOTHING;

INSERT INTO m4_engage.conversation_participants (conversation_id, user_id, role, muted) VALUES
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'buyer', false),
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'agent', false)
ON CONFLICT (conversation_id, user_id) DO NOTHING;

INSERT INTO m4_engage.messages (conversation_id, sender_user_id, kind, body, risk_level, risk_terms) VALUES
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'text', 'สวัสดีครับคุณสมหญิง ห้องที่ The Base ชั้น 12 ยังว่างให้เช่าอยู่ไหมครับ?', 'none', '{}'),
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'text', 'สวัสดีค่ะคุณวิชัย ห้องยังว่างค่ะ พร้อมเข้าอยู่ได้เลย มีเครื่องใช้ไฟฟ้าครบชุดค่ะ', 'none', '{}'),
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'text', 'สะดวกนัดดูห้องจริงวันเสาร์นี้ช่วงบ่าย 2 ไหมครับ?', 'none', '{}'),
  ('70000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'text', 'ได้เลยค่ะ เดี๋ยวสมหญิงกดยืนยันการนัดหมายในระบบให้นะคะ', 'none', '{}');

-- 8. นัดหมายชมทรัพย์ (Appointments)
INSERT INTO m4_engage.appointments (
  id, conversation_id, listing_id, host_user_id, guest_user_id, starts_at, ends_at, status, note
) VALUES (
  '80000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003',
  now() + interval '2 days 4 hours', now() + interval '2 days 5 hours', 'confirmed', 'นัดเจอด้านหน้าล็อบบี้โครงการ The Base'
) ON CONFLICT (id) DO NOTHING;

-- 9. คำสั่งซื้อและการชำระเงิน (Orders & Order Items)
INSERT INTO m5_commerce.orders (
  id, order_no, user_id, status, subtotal_satang, discount_satang, vat_satang, total_satang,
  payment_method, omise_charge_id, paid_at, fulfilled_at, receipt_no
) VALUES (
  '90000000-0000-0000-0000-000000000001', 'ORD-20261006-0001', '10000000-0000-0000-0000-000000000002',
  'fulfilled', 99000, 0, 0, 99000,
  'promptpay', 'chrg_test_5xyz987654321', now() - interval '1 day', now() - interval '1 day', 'REC-202610-0001'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO m5_commerce.order_items (
  id, order_id, package_code, package_name, unit_price_satang, qty, line_total_satang, entitlements_snapshot
) VALUES (
  '91000000-0000-0000-0000-000000000001', '90000000-0000-0000-0000-000000000001', 'pro_agent_m',
  'Pro Agent รายเดือน (โควตา 50 ประกาศ + Microsite)', 99000, 1, 99000,
  '[{"kind": "listing_quota", "qty": 50}, {"kind": "microsite", "qty": 1}]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 10. ความยินยอม PDPA (Consents)
INSERT INTO m1_identity.consents (user_id, purpose, granted, version, ip) VALUES
  ('10000000-0000-0000-0000-000000000001', 'terms', true, '1.0', '127.0.0.1'),
  ('10000000-0000-0000-0000-000000000001', 'privacy', true, '1.0', '127.0.0.1'),
  ('10000000-0000-0000-0000-000000000002', 'terms', true, '1.0', '127.0.0.1'),
  ('10000000-0000-0000-0000-000000000002', 'privacy', true, '1.0', '127.0.0.1'),
  ('10000000-0000-0000-0000-000000000003', 'terms', true, '1.0', '127.0.0.1'),
  ('10000000-0000-0000-0000-000000000003', 'privacy', true, '1.0', '127.0.0.1'),
  ('10000000-0000-0000-0000-000000000003', 'contact_share', true, '1.0', '127.0.0.1');

COMMIT;
