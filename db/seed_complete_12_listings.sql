-- =====================================================================
-- MapNest: ชุดข้อมูลจำลองทรัพย์อุดรธานี ครบทั้ง 12 รายการ (UD-00105 ถึง UD-00112)
-- และซิงก์เข้า m3_discovery.listing_index
-- =====================================================================
BEGIN;

-- สร้างโครงการเพิ่มเติม (Projects)
INSERT INTO m2_listing.projects (id, name_th, name_en, aliases, property_type_code, location, subdistrict_code, verified) VALUES
  ('20000000-0000-0000-0000-000000000004', 'แอสปาย อุดรธานี (Aspire Udonthani)', 'Aspire Udonthani', ARRAY['Aspire', 'แอสปาย'], 'condo', ST_GeogFromText('POINT(102.793 17.408)'), '410101', true),
  ('20000000-0000-0000-0000-000000000005', 'คูเปอร์ สยาม ไพรเวท เรสซิเดนซ์', 'Cooper Siam Private Residence', ARRAY['Cooper Siam', 'คูเปอร์'], 'house', ST_GeogFromText('POINT(102.781 17.425)'), '410101', true),
  ('20000000-0000-0000-0000-000000000006', 'ทาวน์โฮม สิริ เพลส อุดร-โพศรี', 'Siri Place Udon-Phosri', ARRAY['Siri Place', 'สิริเพลส'], 'townhouse', ST_GeogFromText('POINT(102.809 17.399)'), '410102', true),
  ('20000000-0000-0000-0000-000000000007', 'พฤกษาวิลล์ หนองบัว-อุดรธานี', 'Pruksa Ville Nong Bua', ARRAY['Pruksa Ville', 'พฤกษาวิลล์'], 'townhouse', ST_GeogFromText('POINT(102.818 17.412)'), '410102', true)
ON CONFLICT (id) DO NOTHING;

-- L5: UD-00105 (Aspire Udonthani - Condo Rent)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000005', 'UD-00105', '10000000-0000-0000-0000-000000000002', 'agent', 'rent', 'condo', '20000000-0000-0000-0000-000000000004',
  'active', 'approved', 'แอสปาย อุดรธานี (Aspire Udonthani) ชั้น 6 ห้องสตูดิโอ แต่งสวยพร้อมอยู่', 7500, 1, 1, 27.0,
  ST_GeogFromText('POINT(102.793 17.408)'), ST_GeogFromText('POINT(102.793 17.408)'), 'exact', '41', '4101', '410101',
  'direct', now() - interval '1 day', now() + interval '29 days'
) ON CONFLICT (id) DO NOTHING;

-- L6: UD-00106 (Cooper Siam - Luxury House Sale)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000006', 'UD-00106', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'house', '20000000-0000-0000-0000-000000000005',
  'active', 'approved', 'บ้านเดี่ยวพูลวิลล่าสไตล์โมเดิร์น หนองประจักษ์ คูเปอร์ สยาม ไพรเวท', 7900000, 4, 4, 280.0, 85.0,
  ST_GeogFromText('POINT(102.781 17.425)'), ST_GeogFromText('POINT(102.781 17.425)'), 'approximate', '41', '4101', '410101',
  'direct', now() - interval '4 days', now() + interval '26 days'
) ON CONFLICT (id) DO NOTHING;

-- L7: UD-00107 (Sold House - Hidden from active search feed per Blueprint rule O5)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at, sold_at
) VALUES (
  '30000000-0000-0000-0000-000000000007', 'UD-00107', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'house', NULL,
  'sold', 'approved', 'บ้านเดี่ยวชั้นเดียว โซนสนามบินอุดรธานี (ขายแล้ว - Sold Out)', 2650000, 3, 2, 130.0, 60.0,
  ST_GeogFromText('POINT(102.775 17.391)'), ST_GeogFromText('POINT(102.775 17.391)'), 'approximate', '41', '4101', '410101',
  'direct', now() - interval '30 days', now() - interval '2 days', now() - interval '2 days'
) ON CONFLICT (id) DO NOTHING;

-- L8: UD-00108 (Siri Place - Townhome Sale)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000008', 'UD-00108', '10000000-0000-0000-0000-000000000002', 'agent', 'sale', 'townhouse', '20000000-0000-0000-0000-000000000006',
  'active', 'approved', 'ทาวน์โฮม 2 ชั้น สิริ เพลส อุดร-โพศรี ดีไซน์ลอฟท์ หน้ากว้าง 5.7 เมตร', 2190000, 3, 2, 118.0, 21.0,
  ST_GeogFromText('POINT(102.809 17.399)'), ST_GeogFromText('POINT(102.809 17.399)'), 'exact', '41', '4101', '410102',
  'direct', now() - interval '2 days', now() + interval '28 days'
) ON CONFLICT (id) DO NOTHING;

-- L9: UD-00109 (Pruksa Ville - Townhome Rent)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000009', 'UD-00109', '10000000-0000-0000-0000-000000000001', 'owner', 'rent', 'townhouse', '20000000-0000-0000-0000-000000000007',
  'active', 'approved', 'ทาวน์โฮมให้เช่า พฤกษาวิลล์ หนองบัว แต่งครบ แอร์ 3 ตัว พร้อมเข้าอยู่', 12000, 3, 2, 125.0, 24.0,
  ST_GeogFromText('POINT(102.818 17.412)'), ST_GeogFromText('POINT(102.818 17.412)'), 'approximate', '41', '4101', '410102',
  'direct', now() - interval '6 days', now() + interval '24 days'
) ON CONFLICT (id) DO NOTHING;

-- L10: UD-00110 (Land Mitrapap - Land Sale)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000010', 'UD-00110', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'land', NULL,
  'active', 'approved', 'ที่ดินเปล่า 1 ไร่ ติดถนนมิตรภาพ-หนองคาย ใกล้บายพาสอุดรธานี เหมาะสร้างโชว์รูม', 6500000, 400.0,
  ST_GeogFromText('POINT(102.825 17.442)'), ST_GeogFromText('POINT(102.825 17.442)'), 'area_only', '41', '4101', '410102',
  'direct', now() - interval '8 days', now() + interval '22 days'
) ON CONFLICT (id) DO NOTHING;

-- L11: UD-00111 (Nong Prajak House - House Sale)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000011', 'UD-00111', '10000000-0000-0000-0000-000000000001', 'owner', 'sale', 'house', NULL,
  'active', 'approved', 'บ้านเดี่ยวหลังใหญ่ ใกล้สวนหนองประจักษ์ 80 ตร.ว. 4 ห้องนอน ทำเลพรีเมียม', 5200000, 4, 3, 220.0, 80.0,
  ST_GeogFromText('POINT(102.779 17.418)'), ST_GeogFromText('POINT(102.779 17.418)'), 'exact', '41', '4101', '410101',
  'direct', now() - interval '3 days', now() + interval '27 days'
) ON CONFLICT (id) DO NOTHING;

-- L12: UD-00112 (Modern House Sam Phrao - House Rent)
INSERT INTO m2_listing.listings (
  id, public_code, poster_user_id, poster_role, deal_type, property_type_code, project_id,
  status, review_status, title, price_thb, bedrooms, bathrooms, usable_area_sqm, land_area_sqw,
  location, display_location, location_precision, province_code, district_code, subdistrict_code,
  sale_channel, published_at, expires_at
) VALUES (
  '30000000-0000-0000-0000-000000000012', 'UD-00112', '10000000-0000-0000-0000-000000000002', 'agent', 'rent', 'house', NULL,
  'active', 'approved', 'ให้เช่าบ้านเดี่ยวชั้นเดียว โซนสามพร้าว ใกล้มหาวิทยาลัยราชภัฏอุดรธานี (ศูนย์สามพร้าว)', 15000, 3, 2, 140.0, 65.0,
  ST_GeogFromText('POINT(102.835 17.428)'), ST_GeogFromText('POINT(102.835 17.428)'), 'approximate', '41', '4101', '410102',
  'direct', now() - interval '5 days', now() + interval '25 days'
) ON CONFLICT (id) DO NOTHING;

-- ซิงก์เข้า m3_discovery.listing_index ทั้งหมด (ทั้ง 12 ทรัพย์)
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
WHERE l.status IN ('active', 'reserved')
ON CONFLICT (listing_id) DO UPDATE SET
  status = EXCLUDED.status,
  price_thb = EXCLUDED.price_thb,
  title = EXCLUDED.title,
  display_location = EXCLUDED.display_location;

COMMIT;
