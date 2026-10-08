-- =====================================================================
-- MapNest: ชุดข้อมูลจำลองทดสอบเมืองอุดรธานี (Mock Seed Data for Udon Thani)
-- =====================================================================
BEGIN;

-- 1. พื้นที่ปกครอง (Admin Areas)
INSERT INTO core.admin_areas (code, level, parent_code, name_th, name_en, postcode, centroid) VALUES
  ('41', 'province', NULL, 'อุดรธานี', 'Udon Thani', NULL, ST_GeogFromText('POINT(102.79 17.41)')),
  ('4101', 'district', '41', 'เมืองอุดรธานี', 'Mueang Udon Thani', NULL, ST_GeogFromText('POINT(102.79 17.41)')),
  ('410101', 'subdistrict', '4101', 'หมากแข้ง', 'Mak Khaeng', '41000', ST_GeogFromText('POINT(102.787 17.413)')),
  ('410102', 'subdistrict', '4101', 'หนองบัว', 'Nong Bua', '41000', ST_GeogFromText('POINT(102.815 17.408)')),
  ('410103', 'subdistrict', '4101', 'บ้านเลื่อม', 'Ban Lueam', '41000', ST_GeogFromText('POINT(102.765 17.432)'))
ON CONFLICT (code) DO NOTHING;

-- 2. แลนด์มาร์กสำคัญ (Landmarks)
INSERT INTO core.landmarks (id, name_th, category, location, subdistrict_code, aliases) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'เซ็นทรัล อุดรธานี', 'mall', ST_GeogFromText('POINT(102.797 17.405)'), '410101', ARRAY['เซ็นทรัลพลาซา', 'Central Udon']),
  ('a0000000-0000-0000-0000-000000000002', 'ยูดีทาวน์ (UD Town)', 'mall', ST_GeogFromText('POINT(102.805 17.402)'), '410101', ARRAY['UD Town', 'ตลาดรถไฟ']),
  ('a0000000-0000-0000-0000-000000000003', 'มหาวิทยาลัยราชภัฏอุดรธานี', 'university', ST_GeogFromText('POINT(102.792 17.397)'), '410101', ARRAY['มรภ.อุดร', 'UDRU']),
  ('a0000000-0000-0000-0000-000000000004', 'สวนสาธารณะหนองประจักษ์', 'other', ST_GeogFromText('POINT(102.778 17.420)'), '410101', ARRAY['หนองประจักษ์', 'เป็ดเหลือง']),
  ('a0000000-0000-0000-0000-000000000005', 'โรงพยาบาลศูนย์อุดรธานี', 'hospital', ST_GeogFromText('POINT(102.784 17.416)'), '410101', ARRAY['รพ.ศูนย์', 'รพ.อุดร'])
ON CONFLICT (id) DO NOTHING;

-- 3. ผู้ใช้จำลอง (Users & Roles)
INSERT INTO m1_identity.users (id, display_name, email, phone_e164, status) VALUES
  ('10000000-0000-0000-0000-000000000001', 'สมชาย เจ้าของห้อง', 'somchai.owner@mapnest.io', '+66811112222', 'active'),
  ('10000000-0000-0000-0000-000000000002', 'สมหญิง นายหน้ามือทอง', 'somying.agent@mapnest.io', '+66833334444', 'active'),
  ('10000000-0000-0000-0000-000000000003', 'วิชัย ผู้ซื้อใจถึง', 'wichai.buyer@mapnest.io', '+66855556666', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO m1_identity.user_roles (user_id, role) VALUES
  ('10000000-0000-0000-0000-000000000001', 'owner'),
  ('10000000-0000-0000-0000-000000000002', 'agent'),
  ('10000000-0000-0000-0000-000000000003', 'buyer')
ON CONFLICT (user_id, role) DO NOTHING;

INSERT INTO m1_identity.agent_profiles (user_id, kyc_status, microsite_slug, service_district_codes, rating_avg, rating_count) VALUES
  ('10000000-0000-0000-0000-000000000002', 'verified', 'somying-udon-property', ARRAY['4101'], 4.90, 18)
ON CONFLICT (user_id) DO NOTHING;

-- 4. ประเภททรัพย์และสิ่งอำนวยความสะดวก
INSERT INTO m2_listing.property_types (code, name_th, name_en, sort_order) VALUES
  ('condo', 'คอนโดมิเนียม', 'Condominium', 1),
  ('house', 'บ้านเดี่ยว', 'Single House', 2),
  ('townhouse', 'ทาวน์โฮม', 'Townhome', 3),
  ('land', 'ที่ดิน', 'Land', 4),
  ('commercial', 'อาคารพาณิชย์', 'Commercial Building', 5)
ON CONFLICT (code) DO NOTHING;

INSERT INTO m2_listing.amenities (code, name_th, category, sort_order) VALUES
  ('pool', 'สระว่ายน้ำ', 'facility', 1),
  ('gym', 'ฟิตเนส', 'facility', 2),
  ('security_24h', 'รปภ. 24 ชั่วโมง', 'security', 3),
  ('cctv', 'กล้องวงจรปิด', 'security', 4),
  ('parking', 'ที่จอดรถ', 'facility', 5),
  ('near_mall', 'ใกล้ห้างสรรพสินค้า', 'nearby', 6)
ON CONFLICT (code) DO NOTHING;

-- 5. โครงการจำลอง (Projects)
INSERT INTO m2_listing.projects (id, name_th, name_en, aliases, property_type_code, location, subdistrict_code, verified) VALUES
  ('20000000-0000-0000-0000-000000000001', 'ลุมพินี เพลส ยูดี-โพศรี', 'Lumpini Place UD-Phosri', ARRAY['LPN โพศรี', 'ลุมพินี อุดร'], 'condo', ST_GeogFromText('POINT(102.801 17.404)'), '410101', true),
  ('20000000-0000-0000-0000-000000000002', 'เดอะ เบส เซ็นทรัล อุดรธานี', 'The Base Central Udon', ARRAY['The Base', 'เดอะเบส อุดร'], 'condo', ST_GeogFromText('POINT(102.798 17.406)'), '410101', true),
  ('20000000-0000-0000-0000-000000000003', 'ศุภาลัย เบลล่า อุดรธานี', 'Supalai Bella Udon', ARRAY['ศุภาลัย อุดร'], 'house', ST_GeogFromText('POINT(102.768 17.435)'), '410103', true)
ON CONFLICT (id) DO NOTHING;

-- 6. ประกาศตัวอย่าง (Listings)
-- L1: คอนโด LPN ชั้น 8 ใกล้ UD Town (Active)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000001', 'UD-00101', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'condo', '20000000-0000-0000-0000-000000000001',
  'active', 'approved', 'ขายด่วน ลุมพินี ยูดี-โพศรี ชั้น 8 วิวสระ แต่งครบพร้อมอยู่ ติด UD Town', 1450000, 1, 1, 28.5,
  ST_GeogFromText('POINT(102.8012 17.4041)'), ST_GeogFromText('POINT(102.8015 17.4045)'), 'approximate', '41', '4101', '410101',
  'direct', now(), now() + interval '30 days'
) ON CONFLICT (id) DO NOTHING;

-- L2: คอนโด The Base ติดเซ็นทรัล (Active - โดย Agent สมหญิง)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000002', 'UD-00102', '10000000-0000-0000-0000-000000000002', 'agent', 'rent', 'condo', '20000000-0000-0000-0000-000000000002',
  'active', 'approved', 'ให้เช่า The Base Central Udon ห้องมุม ชั้น 12 เดินไปเซ็นทรัลแค่ 1 นาที', 8500, 1, 1, 31.0,
  ST_GeogFromText('POINT(102.7981 17.4062)'), ST_GeogFromText('POINT(102.7984 17.4065)'), 'exact', '41', '4101', '410101',
  'direct', now(), now() + interval '30 days'
) ON CONFLICT (id) DO NOTHING;

-- L3: บ้านเดี่ยว ศุภาลัย เบลล่า ใกล้หนองประจักษ์ (Reserved - ติดจอง มีวันครบกำหนด)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, reserved_until, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000003', 'UD-00103', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'house', '20000000-0000-0000-0000-000000000003',
  'reserved', 'approved', 'บ้านเดี่ยว ศุภาลัย เบลล่า 2 ชั้น 54 ตร.ว. บรรยากาศเงียบสงบ (ติดจอง)', 3890000, 3, 3, 160.0, 54.0,
  ST_GeogFromText('POINT(102.7682 17.4351)'), ST_GeogFromText('POINT(102.7690 17.4360)'), 'approximate', '41', '4101', '410103',
  'direct', now() + interval '7 days', now() - interval '5 days', now() + interval '25 days'
) ON CONFLICT (id) DO NOTHING;

-- L4: ที่ดินเปล่าใจกลางเมือง หมากแข้ง (Active - ฝาก Agent Hub Exclusive)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, hub_mode, commission_pct, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000004', 'UD-00104', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'land', NULL,
  'active', 'approved', 'ขายที่ดินเปล่า 120 ตร.ว. ซอยจินตคาม ใกล้ มรภ.อุดร เหมาะสร้างหอพัก', 2400000, 120.0,
  ST_GeogFromText('POINT(102.7942 17.3985)'), ST_GeogFromText('POINT(102.7950 17.3990)'), 'area_only', '41', '4101', '410101',
  'agent_hub', 'exclusive', 3.00, now(), now() + interval '30 days'
) ON CONFLICT (id) DO NOTHING;

-- 7. ซิงก์เข้าตารางค้นหา listing_index (Read Model สำหรับ Agoda-style Search)
INSERT INTO m3_discovery.listing_index (
  listing_id, public_code, status, deal_type, property_type_code, price_thb, bedrooms, bathrooms,
  usable_area_sqm, land_area_sqw, display_location, province_code, district_code, subdistrict_code,
  project_id, project_name, title, cover_url, amenity_codes, poster_role, agent_verified, sale_channel,
  rank_score, published_at
)
SELECT 
  l.id, l.public_code, l.status, l.deal_type, l.property_type_code, l.price_thb, l.bedrooms, l.bathrooms,
  l.usable_area_sqm, l.land_area_sqw, l.display_location, l.province_code, l.district_code, l.subdistrict_code,
  l.project_id, p.name_th, l.title, 'https://cdn.mapnest.io/photos/demo_cover.webp', ARRAY['pool', 'gym'],
  l.poster_role, (l.poster_role = 'agent'), l.sale_channel, 95.5, l.published_at
FROM m2_listing.listings l
LEFT JOIN m2_listing.projects p ON l.project_id = p.id
ON CONFLICT (listing_id) DO NOTHING;

-- 8. ความต้องการของผู้ซื้อ (Criteria - คุณวิชัย หาคอนโดรอบ มรภ.อุดร รัศมี 2.5 กม.)
INSERT INTO m4_engage.criteria (
  id, user_id, deal_type, property_type_codes, price_min_thb, price_max_thb, center, display_center, radius_m, status
) VALUES (
  '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'sale', ARRAY['condo'],
  1000000, 2000000, ST_GeogFromText('POINT(102.792 17.397)'), ST_GeogFromText('POINT(102.792 17.397)'), 2500, 'active'
) ON CONFLICT (id) DO NOTHING;

-- 9. แพ็กเกจสินค้าในร้านค้า (Packages)
INSERT INTO m5_commerce.packages (code, name_th, audience, price_satang, duration_days, entitlements, is_active) VALUES
  ('boost_7d', 'ดันประกาศ 7 วัน (Top of List)', 'owner', 19900, 7, '[{"kind": "boost", "qty": 1}]'::jsonb, true),
  ('spotlight_14d', 'Spotlight ติดดาวบนแผนที่ 14 วัน', 'owner', 49900, 14, '[{"kind": "spotlight", "qty": 1}]'::jsonb, true),
  ('pro_agent_m', 'Pro Agent รายเดือน (โควตา 50 ประกาศ + Microsite)', 'agent', 99000, 30, '[{"kind": "listing_quota", "qty": 50}, {"kind": "microsite", "qty": 1}]'::jsonb, true)
ON CONFLICT (code) DO NOTHING;

COMMIT;
